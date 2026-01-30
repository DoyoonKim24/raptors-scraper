import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.alerts import check_alerts
from apscheduler.schedulers.blocking import BlockingScheduler


if __name__ == "__main__":
    check_alerts()
    
    scheduler = BlockingScheduler()
    
    # Schedule check_alerts to run every 10 minutes
    scheduler.add_job(check_alerts, 'interval', minutes=10)
    
    print("Scheduler started. Running alerts check every 10 minutes.")
    scheduler.start()

