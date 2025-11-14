from flask import Flask, request
from flask_cors import CORS
from getQuickpicks import monitor_prices

app = Flask(__name__)
CORS(app)

@app.route('/seats')
def seats():
    event_id = "1000631AC86A30A0"

    sections = request.args.get('sections')
    max_price = request.args.get('max_price', type=int)
    tickets = request.args.get('tickets', type=int)
    offset = request.args.get('offset', type=int, default=0)
    print(f"Received request - Sections: {sections}, Max Price: {max_price}, Tickets: {tickets}, Offset: {offset}")

    data = monitor_prices(event_id, sections, max_price, tickets, offset)
    return data

@app.route('/')
def home():
    return 'Ticketmaster Quickpicks API is running.'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)