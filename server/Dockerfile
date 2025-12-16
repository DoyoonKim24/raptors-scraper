FROM mcr.microsoft.com/playwright/python:v1.56.0-jammy

WORKDIR /app

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY *.py .

# Ensure browsers are available
RUN playwright install chromium

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "server:app"]
