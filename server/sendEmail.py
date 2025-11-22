import os
import requests
from dotenv import load_dotenv

load_dotenv()

def send_email_notification(email, tickets):
  	return requests.post(
  		"https://api.mailgun.net/v3/mailgun.doyoonkim.work/messages",
  		auth=("api", os.environ.get('MAILGUN_API_KEY')),
  		data={"from": "Mailgun Sandbox <postmaster@mailgun.doyoonkim.work>",
			"to": email,
  			"subject": "Tickets Found!",
  			"text": f"New tickets matching your criteria have been found:\n\n{tickets}"
			}
		)

# if __name__ == "__main__":
#     response = send_email_notification()
#     print(f"Status: {response.status_code}")
#     print(f"Response: {response.text}")

