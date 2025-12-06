import time
import datetime
from supabaseClient import supabase
from getQuickpicks import fetch_all_prices
from sendEmail import send_email_notification


def check_alerts():
  print(f"[{datetime.datetime.now()}] Starting alert check...")
  
  try:
    # 1. Fetch all active alerts
    alerts = (
      supabase.table("alerts")
      .select("*")
      .execute()
    ).data

    print(f"[{datetime.datetime.now()}] Found {len(alerts)} active alerts.")

    for alert in alerts:
      alert_id = alert["id"]
      email = alert["email"]
      event_id = alert["event_id"]
      sections = alert["sections"]
      max_price = alert["max_price"]
      ticket_count = alert["ticket_count"]
      row = alert["row"]
      expires = alert["expires"]

      expires_dt = datetime.datetime.fromisoformat(expires)
      print(f"Expires at: {expires_dt}")
      # Get current UTC time
      now = datetime.datetime.now(datetime.timezone.utc)
      print(f"Current time: {now}")

      # Compare
      if expires_dt <= now:
         supabase.table("alerts").delete().eq("id", alert_id).execute()
         continue

      print(f"[{datetime.datetime.now()}] Processing alert {alert_id} for {email}")

      print(f"sections: {sections}")
      # 2. Query Ticketmaster using your existing function
      results = fetch_all_prices(
          event_id=event_id,
          sections=sections,
          max_price=max_price,
          max_row=row,
          tickets=ticket_count,
      )
      
      print(f"[{datetime.datetime.now()}] Found {len(results.get('picks', []))} ticket options for alert {alert_id}")

      # 3. Check if any seats match user conditions
      tickets = []
      for pick in results["picks"]:
        # Get offer ID from pick
        offer_id = pick.get("offerGroups", [{}])[0].get("offers", [{}])[0]
        
        # Find corresponding offer in results.offers
        total_price = None
        for offer in results["offers"]:
          if offer.get("offerId") == offer_id:
            total_price = offer.get("totalPrice")
            break

        seats = pick.get("offerGroups", [{}])[0].get("seats", [])

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
      if previous_history and len(previous_history) > 0:
        previous_tickets.extend(previous_history[0]["found_tickets"])
      # Find new tickets that weren't found before
      newTickets = []
      for ticket in tickets:
        if ticket not in previous_tickets:
          newTickets.append(ticket)

      # 4. Send email
      if newTickets and len(newTickets) > 0:
          print(f"[{datetime.datetime.now()}] Sending email notification for {len(newTickets)} new tickets to {email}")
          send_email_notification(email, newTickets)
      else:
          print(f"[{datetime.datetime.now()}] No new tickets found for alert {alert_id}")

      # Update alert history with new tickets
      supabase.table("alert_history").upsert(
        {"alert_id": alert_id, "found_tickets": tickets},
        on_conflict="alert_id"
      ).execute()
      print(f"[{datetime.datetime.now()}] Updated history for alert {alert_id}")

  except Exception as e:
    print(f"[{datetime.datetime.now()}] ERROR: {str(e)}")
    
  print(f"[{datetime.datetime.now()}] Alert check completed!")


def start_worker(interval_seconds=60):
    print(f"Cron worker started. Checking every {interval_seconds} seconds...")
    while True:
        try:
            check_alerts()
        except Exception as e:
            print("Worker error:", e)

        time.sleep(interval_seconds)


if __name__ == "__main__":
    print(f"[{datetime.datetime.now()}] Cron job started on Render!")
    check_alerts()
    print(f"[{datetime.datetime.now()}] Cron job finished!")
    # start_worker(60)
