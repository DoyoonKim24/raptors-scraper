import os
import requests
from dotenv import load_dotenv

load_dotenv()

def send_email_notification():
  	return requests.post(
  		"https://api.mailgun.net/v3/mailgun.doyoonkim.work/messages",
  		auth=("api", os.environ.get('MAILGUN_API_KEY')),
  		data={"from": "Mailgun Sandbox <postmaster@mailgun.doyoonkim.work>",
			"to": "Stella Delorey <deloreyste@gmail.com>",
  			"subject": "Subway compensation",
  			"text": "Hello stella, you have just been delivered a italian bmt subway sandwich. as compensation you owe the sender 11 blowies. please give kinches to the camera if you agree to these terms. thank you for your cooperation."
			}
		)

if __name__ == "__main__":
    response = send_email_notification()
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")

