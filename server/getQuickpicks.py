import requests, json, time, os
from playwright.sync_api import sync_playwright

SESSION_FILE = "tm_session.json"

def get_new_session(event_url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        logs = []
        def log_request(req):
            if "offeradapter.ticketmaster.ca" in req.url:
                logs.append({
                    "url": req.url,
                    "headers": dict(req.headers)
                })
        page.on("request", log_request)
        page.goto(event_url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(10000)

        cookies = context.cookies()
        browser.close()

    cookies_dict = {c["name"]: c["value"] for c in cookies}
    
    headers = logs[0]["headers"]
    
    session = {"cookies": cookies_dict, "headers": headers}
    with open(SESSION_FILE, "w") as f:
        json.dump(session, f)
    return session

def load_session(event_url):
    if os.path.exists(SESSION_FILE):
        with open(SESSION_FILE) as f:
            session = json.load(f)
        return session
    else:
        return get_new_session(event_url)

def fetch_prices(event_id, sections, max_price, max_row, tickets, offset=0):
    base_url = f"https://offeradapter.ticketmaster.ca/api/ismds/event/{event_id}/quickpicks"
    session = load_session(f"https://www.ticketmaster.ca/event/{event_id}")
    
    def compare_rows(row1, row2):
        def get_row_value(row):
            if isinstance(row, str) and len(row) == 1 and row.isalpha():
                return ord(row.upper()) - 64
            elif row.isdigit():
                return int(row) + 100
            else:
                return 1000 + ord(row[0]) if row else 1000
        val1 = get_row_value(row1)
        val2 = get_row_value(row2)
        return val1 - val2
    
    if sections is None and max_price is None:
        q_param = "not('accessible')"
    elif sections is None:
        q_param = f"and(not('accessible'),any(totalprices,$and(gte(@,0),lte(@,{max_price}))))"
    elif max_price is None:
        q_param = f"and(not('accessible'),any(shapes,{sections}))"
    else:
        q_param = f"and(not('accessible'),and(any(shapes,{sections}),any(totalprices,$and(gte(@,0),lte(@,{max_price})))))"

    print(f"Query Param: {q_param}")
    params = {
        'show': 'places+maxQuantity+sections',
        'mode': 'primary:ppsectionrow+resale:ga_areas+platinum:all',
        'qty': tickets,
        'q': q_param,
        'includeStandard': 'true',
        'includeResale': 'true',
        'includePlatinumInventoryType': 'false',
        'ticketTypes': '000000000001',
        'embed': ['area', 'offer', 'description'],
        'apikey': 'b462oi7fic6pehcdkzony5bxhe',
        'apisecret': 'pquzpfrfz7zd2ylvtz3w5dtyse',
        'resaleChannelId': 'internal.ecommerce.consumer.desktop.web.browser.ticketmaster.ca',
        'limit': '40',
        'offset': str(offset),
        'sort': 'noTaxTotalprice'
    }
    
    # Add random delay to make requests look more human
    import random
    time.sleep(random.uniform(0.5, 1.5))
    
    for retry in range(2):
        r = requests.get(base_url, headers=session["headers"], cookies=session["cookies"], params=params)
        if r.status_code == 200:
            data = r.json()
            data['last_batch'] = (len(data.get('picks', [])) < 40)
            
            # Apply row filtering if max_row is specified
            if max_row and max_row != 'All Rows':
                filtered_picks = []
                for pick in data.get('picks', []):
                    row = pick.get('row', '')
                    if compare_rows(row, max_row) <= 0:
                        filtered_picks.append(pick)
                data['picks'] = filtered_picks
                data['total'] = len(filtered_picks)
            else :
                data['total'] = len(data.get('picks', []))
            
            return data
        elif r.status_code == 429:  # Rate limit
            wait_time = random.uniform(3, 8)
            print(f"[{r.status_code}] Rate limited. Waiting {wait_time:.1f} seconds...")
            time.sleep(wait_time)
        else:
            print(f"[{r.status_code}] Refreshing session...")
            session = get_new_session(f"https://www.ticketmaster.ca/event/{event_id}")
            time.sleep(random.uniform(2, 4))
    raise Exception("Session refresh failed")

def fetch_all_prices(event_id, sections, max_price, max_row, tickets):
    all_picks = []
    all_offers = []
    offset = 0

    while True:
        data = fetch_prices(event_id, sections, max_price, max_row, tickets, offset)
        picks = data.get('picks', [])
        all_picks.extend(picks)
        offers = data.get('_embedded', {}).get('offer', [])
        all_offers.extend(offers)
        if not data.get('last_batch', True):
            offset += len(picks)
        else:
            break
    return {"picks": all_picks, "offers": all_offers}