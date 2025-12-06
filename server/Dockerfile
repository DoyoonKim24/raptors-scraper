FROM mcr.microsoft.com/playwright/python:v1.40.0-jammy

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Install Playwright browsers
RUN playwright install chromium

CMD ["python", "cronCheck.py"]