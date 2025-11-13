from flask import Flask, request
from flask_cors import CORS
from getQuickpicks import monitor_prices

app = Flask(__name__)
CORS(app)

@app.route('/seats')
def seats():
    event_id = "1000631AC8663089"
    event_url = f"https://www.ticketmaster.ca/event/{event_id}"

    sections = request.args.get('sections', '')
    max_price = request.args.get('max_price', type=int)

    data = monitor_prices(event_id, event_url, sections, max_price, interval=300)
    return data

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)