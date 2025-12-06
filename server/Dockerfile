FROM mcr.microsoft.com/playwright/python:v1.40.0-jammy

WORKDIR /app

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application files
COPY . .

# Install Playwright browsers (this is the key step!)
RUN playwright install chromium
RUN playwright install-deps chromium

CMD ["python", "cronCheck.py"]