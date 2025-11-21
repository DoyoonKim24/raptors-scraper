import time
from datetime import datetime, timedelta
from supabaseClient import supabase
from getQuickpicks import fetch_all_prices
from send_email import send_email_notification


def check_alerts():
    # 1. Fetch all active alerts
    alerts = (
        supabase.table("alerts")
        .select("*")
        .eq("notified", False)
        .execute()
    ).data

    print(f"Found {len(alerts)} active alerts.")

    for alert in alerts:
        alert_id = alert["id"]
        email = alert["email"]
        event_id = alert["event_id"]
        sections = alert["sections"]
        max_price = alert["max_price"]
        ticket_count = alert["ticket_count"]
        row = alert["row"]

        # 2. Query Ticketmaster using your existing function
        results = fetch_all_prices(
            event_id=event_id,
            sections=sections,
            max_price=max_price,
            max_row=row,
            tickets=ticket_count,
        )

        # 3. Check if any seats match user conditions
        if results and len(results.get("picks", [])) > 0:
            # 4. Send email
            send_email_notification(email, results)

            # 5. Mark alert as "notified" so user doesn't get spammed
            supabase.table("alerts").update(
                {"notified": True, "notified_at": datetime.utcnow().isoformat()}
            ).eq("id", alert_id).execute()

            print(f"Notified {email} for alert {alert_id}")

def start_worker(interval_seconds=60):
    print(f"Cron worker started. Checking every {interval_seconds} seconds...")
    while True:
        try:
            check_alerts()
        except Exception as e:
            print("Worker error:", e)

        time.sleep(interval_seconds)


if __name__ == "__main__":
    start_worker(60)
