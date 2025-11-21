from flask import Flask, request
from flask_cors import CORS
from supabaseClient import supabase
from getQuickpicks import fetch_prices

app = Flask(__name__)
CORS(app, origins="http://localhost:5173", supports_credentials=True)

@app.route('/seats')
def seats():
    event_id = request.args.get('event_id')
    sections = request.args.get('sections')
    max_price = request.args.get('max_price', type=int)
    max_row = request.args.get('max_row')
    tickets = request.args.get('tickets', type=int)
    offset = request.args.get('offset', type=int, default=0)
    print(f"Received request - Sections: {sections}, Max Price: {max_price}, Max Row: {max_row}, Tickets: {tickets}, Offset: {offset}")

    data = fetch_prices(event_id, sections, max_price, max_row, tickets, offset)
    return data

@app.route('/set-notification', methods=['POST'])
def set_notification():
    content = request.json
    email = content.get('email')
    event_id = content.get('event_id')
    sections = content.get('sections')
    max_price = content.get('max_price')
    ticket_count = content.get('ticket_count')
    row = content.get('row')
    expires = content.get('expires')

    # Insert notification request into Supabase
    response = supabase.table('alerts').insert({
        'email': email,
        'event_id': event_id,
        'sections': sections,
        'max_price': max_price,
        'ticket_count': ticket_count,
        'row': row,
        'expires': expires,
    }).execute()

    if response:
        return {'message': 'Notification request set successfully.'}, 201
    else:
        return {'message': 'Failed to set notification request.'}, 500
    



@app.route('/')
def home():
    return 'Ticketmaster Quickpicks API is running.'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
