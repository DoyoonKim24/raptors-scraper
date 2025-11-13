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

def fetch_prices(event_id, params, event_url, max_retries=2):
    base_url = f"https://offeradapter.ticketmaster.ca/api/ismds/event/{event_id}/quickpicks"
    session = load_session(event_url)
    for _ in range(max_retries):
        r = requests.get(base_url, headers=session["headers"], cookies=session["cookies"], params=params)
        if r.status_code == 200:
            return r
        print(f"[{r.status_code}] Refreshing session...")
        session = get_new_session(event_url)
        time.sleep(2)
    raise Exception("Session refresh failed")

def monitor_prices(event_id, event_url, section_targets, interval=60):
    while True:
        params = {
            'show': 'places+maxQuantity+sections',
            'mode': 'primary:ppsectionrow+resale:ga_areas+platinum:all',
            'qty': '2',  
            'q': "and(not('accessible'), and(any(shapes,'s_37','s_28'), any(totalprices, $and(gte(@, 49), lte(@, 200)))))",
            'includeStandard': 'true',
            'includeResale': 'true',
            'includePlatinumInventoryType': 'false',
            'ticketTypes': '000000000001,0C000100000A',
            'embed': ['area', 'offer', 'description'],
            'apikey': 'b462oi7fic6pehcdkzony5bxhe',
            'apisecret': 'pquzpfrfz7zd2ylvtz3w5dtyse',
            'resaleChannelId': 'internal.ecommerce.consumer.desktop.web.browser.ticketmaster.ca',
            'limit': '40',
            'offset': '0',
            'sort': 'noTaxTotalprice',
        }
        r = fetch_prices(event_id, params, event_url)
        data = r.json()
        with open("quickpicks.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        break
        # # Example extraction logic
        # for offer in data.get("_embedded", {}).get("offers", []):
        #     section = offer.get("place", {}).get("section", {}).get("name")
        #     price = offer.get("price", {}).get("amount")
        #     if section in section_targets and price <= section_targets[section]:
        #         print(f"🔥 {section} hit target: ${price}")
        
        # print("Checked. Waiting for next run...")
        # time.sleep(interval)

# usage
event_id = "1000631AC8663089"
event_url = f"https://www.ticketmaster.ca/event/{event_id}"
targets = {"SEC 102": 150, "SEC 103": 120}

monitor_prices(event_id, event_url, targets, interval=300)
