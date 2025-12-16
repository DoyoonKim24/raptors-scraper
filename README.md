# Raptors Ticket Finder

A tool to help Raptors fans monitor Ticketmaster for specific seats at their target price. Users can filter by section, row, and maximum price, and get notified via email when tickets matching their criteria become available.

## Tech Stack

- **Frontend:** React
- **Backend:** Flask (Python)
- **Database:** Supabase (PostgreSQL)
- **Web scraping / API access:** Playwright
- **Email notifications:** Mailgun
- **Background worker:** Python Cron-like function

## Features

- **Web Scraping**: Ticketmaster data extraction, getting header and cookie data using Playwright
- **Email Notifications**: Automated email alerts for updates
- **Cron Jobs**: Scheduled task execution
- **Data Filtering**: Advanced filtering and search capabilities
- **Database Integration**: Supabase integration for data persistence

