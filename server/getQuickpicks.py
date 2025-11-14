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

def fetch_prices(event_id, params, max_retries=2):
    base_url = f"https://offeradapter.ticketmaster.ca/api/ismds/event/{event_id}/quickpicks"
    session = load_session(f"https://www.ticketmaster.ca/event/{event_id}")
    
    # Add random delay to make requests look more human
    import random
    time.sleep(random.uniform(0.5, 1.5))
    
    for retry in range(max_retries):
        r = requests.get(base_url, headers=session["headers"], cookies=session["cookies"], params=params)
        if r.status_code == 200:
            return r
        elif r.status_code == 429:  # Rate limit
            wait_time = random.uniform(3, 8)
            print(f"[{r.status_code}] Rate limited. Waiting {wait_time:.1f} seconds...")
            time.sleep(wait_time)
        else:
            print(f"[{r.status_code}] Refreshing session...")
            session = get_new_session(f"https://www.ticketmaster.ca/event/{event_id}")
            time.sleep(random.uniform(2, 4))
    raise Exception("Session refresh failed")

def monitor_prices(event_id, sections, max_price, tickets, offset=0):
    if sections is None and max_price is None:
        q_param = "not('accessible')"
    elif sections is None:
        q_param = f"and(not('accessible'),any(totalprices,$and(gte(@,0),lte(@,{max_price}))))"
    elif max_price is None:
        q_param = f"and(not('accessible'),any(shapes,{sections}))"
    else:
        q_param = f"and(not('accessible'),and(any(shapes,{sections}),any(totalprices,$and(gte(@,0),lte(@,{max_price})))))"
    
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
    
    r = fetch_prices(event_id, params)
    data = r.json()
    return data
        # # Example extraction logic
        # for offer in data.get("_embedded", {}).get("offers", []):
        #     section = offer.get("place", {}).get("section", {}).get("name")
        #     price = offer.get("price", {}).get("amount")
        #     if section in section_targets and price <= section_targets[section]:
        #         print(f"🔥 {section} hit target: ${price}")
        
        # print("Checked. Waiting for next run...")
        # time.sleep(interval)

