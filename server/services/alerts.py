import datetime
from clients.supabase import supabase
from services.ticketmaster import fetch_all_prices
from clients.mailgun import send_email_notification


def check_alerts():
    print("Starting alert check...")

    try:
        # Fetch all active alerts
        alerts = (
            supabase.table("alerts")
            .select("*")
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
            expires = alert["expires"]
            event_name = alert["event_name"]
            event_date = alert["event_date"]

            expires_dt = datetime.datetime.fromisoformat(expires)
            now = datetime.datetime.now(datetime.timezone.utc)

            # delete entry if event has passed
            if expires_dt <= now:
                supabase.table("alerts").delete().eq("id", alert_id).execute()
                continue

            print(f"Processing alert {alert_id} for {email}")

            results = fetch_all_prices(
                event_id=event_id,
                sections=sections,
                max_price=max_price,
                max_row=row,
                tickets=ticket_count,
            )

            # Map offers by ID for O(1) lookup
            offers_by_id = {}
            for offer in results["offers"]:
                offer_id = offer["offerId"]
                if offer_id is not None:
                    offers_by_id[offer_id] = offer

            tickets = []
            for pick in results["picks"]:
                # Get offer ID from pick
                offer_id = pick["offerGroups"][0]["offers"][0]

                total_price = offers_by_id.get(offer_id, {}).get("totalPrice")

                seats = pick["offerGroups"][0].get("seats")

                ticket = {
                    "section": pick.get("section"),
                    "row": pick.get("row"),
                    "seats": ", ".join(map(str, seats)) if seats else "",
                    "total_price": total_price,
                }
                tickets.append(ticket)

            # Compare with previously found tickets
            previous_history = (
                supabase.table("alert_history")
                .select("found_tickets")
                .eq("alert_id", alert_id)
                .execute()
            ).data

            previous_tickets = []
            if previous_history:
                previous_tickets.extend(previous_history[0]["found_tickets"])
            # Find new tickets that weren't found before
            newTickets = []
            for ticket in tickets:
                if ticket not in previous_tickets:
                    newTickets.append(ticket)

            # Send email
            if newTickets:
                print(f"Sending email notification for {len(newTickets)} new tickets to {email}")
                send_email_notification(email, newTickets, event_name, event_date)

                # Update alert history with new tickets
                supabase.table("alert_history").upsert(
                    {"alert_id": alert_id, "found_tickets": tickets},
                    on_conflict="alert_id"
                ).execute()
            else:
                print(f"No new tickets found for alert {alert_id}")

    except Exception as e:
        print(f"ERROR: {str(e)}")

    print("Alert check completed!")

if __name__ == "__main__":
    check_alerts()