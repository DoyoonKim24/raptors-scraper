from playwright.sync_api import sync_playwright
import json

EVENT_ID = "1000631AC8663089"

def capture_quickpicks(event_id):
    base_page = f"https://www.ticketmaster.ca/event/{event_id}"
    target_domain = "offeradapter.ticketmaster.ca"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        quickpick_response = {}

        def log_response(response):
            if target_domain in response.url and "/quickpicks" in response.url:
                try:
                    quickpick_response["url"] = response.url
                    quickpick_response["status"] = response.status
                    quickpick_response["json"] = response.json()
                except Exception:
                    pass

        page.on("response", log_response)
        page.goto(base_page, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(10000)

        browser.close()
        return quickpick_response

data = capture_quickpicks(EVENT_ID)
print(json.dumps(data, indent=2))
