import os
import requests
from dotenv import load_dotenv

load_dotenv()

def send_simple_message():
  	return requests.post(
  		"https://api.mailgun.net/v3/mailgun.doyoonkim.work/messages",
  		auth=("api", os.environ.get('MAILGUN_API_KEY')),
  		data={"from": "Mailgun Sandbox <postmaster@mailgun.doyoonkim.work>",
			"to": "Doyoon Kim <kimdoyo424@gmail.com>",
  			"subject": "Hello Doyoon Kim",
  			"text": "Congratulations Doyoon Kim, you just sent an email with Mailgun! You are truly awesome!"})

