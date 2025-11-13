import json

# Load the data
with open('ticketmaster_data.json', 'r') as f:
    data = json.load(f)['_embedded']["offer"]


# Filter out entries that have a "section" field
filtered_data = []
for ticket in data:
    if 'section' in ticket:
      if ticket['section'] == "121":
          if int(ticket['row']) <= 22:
              if ticket['totalPrice'] == 186.78:
                filtered_data.append(ticket)

# Save the filtered data
with open('filtered_data.json', 'w') as f:
    json.dump(filtered_data, f, indent=2)

print(f"Original entries: {len(data)}")
print(f"Filtered entries (no sections): {len(filtered_data)}")