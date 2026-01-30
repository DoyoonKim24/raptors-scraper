import os
import requests
from dotenv import load_dotenv

load_dotenv()

def send_email_notification(email, tickets, event_name=None, event_date=None):
    rows_html = ""
    for ticket in tickets or []:
        section = ticket["section"]
        row = ticket["row"]
        seats = ticket["seats"]
        price = ticket["total_price"]
        rows_html += (
            f"<tr>"
            f"<td style=\"padding:4px 8px; border-bottom:1px solid #eee;\">{section}</td>"
            f"<td style=\"padding:4px 8px; border-bottom:1px solid #eee;\">{row}</td>"
            f"<td style=\"padding:4px 8px; border-bottom:1px solid #eee;\">{seats}</td>"
            f"<td style=\"padding:4px 8px; border-bottom:1px solid #eee; text-align:right;\">${price}</td>"
            f"</tr>"
        )

    email_body_html = (
        "<div style=\"font-family: Arial, sans-serif; font-size: 14px; color: #222;\">"
        "<p style=\"margin:0 0 8px 0;\">New tickets matching your criteria have been found!</p>"
        + (f"<p style=\"margin:0 0 4px 0;\"><strong>Event:</strong> {event_name}</p>")
        + (f"<p style=\"margin:0 0 12px 0;\"><strong>Date:</strong> {event_date}</p>")
        + "<table style=\"border-collapse:collapse; width:100%; max-width:600px;\">"
        + "<thead><tr>"
        + "<th align=\"left\" style=\"padding:4px 8px; border-bottom:2px solid #ddd;\">Section</th>"
        + "<th align=\"left\" style=\"padding:4px 8px; border-bottom:2px solid #ddd;\">Row</th>"
        + "<th align=\"left\" style=\"padding:4px 8px; border-bottom:2px solid #ddd;\">Seats</th>"
        + "<th align=\"right\" style=\"padding:4px 8px; border-bottom:2px solid #ddd;\">Price</th>"
        + "</tr></thead>"
        + "<tbody>" + rows_html + "</tbody>"
        + "</table>"
        + "</div>"
    )

    return requests.post(
        "https://api.mailgun.net/v3/mailgun.doyoonkim.work/messages",
        auth=("api", os.environ.get("MAILGUN_API_KEY")),
        data={
            "from": "Mailgun Sandbox <postmaster@mailgun.doyoonkim.work>",
            "to": email,
            "subject": "Tickets Found!",
            "html": email_body_html,
        }
    )
