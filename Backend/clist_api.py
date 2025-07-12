import requests
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()
USER = os.getenv("USERNAME")
KEY = os.getenv("API_KEY")

TOP_SITES = {
    "codeforces.com",
    "codechef.com",
    "atcoder.jp",
    "leetcode.com",
    "hackerearth.com",
    "hackerrank.com",
    "topcoder.com",
    "ac.nowcoder.com",
}

def fetch_contests():
    # Get current UTC time for filtering
    now_utc = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
    
    # Fetch contests that haven't started yet (start time > current time)
    url = f"https://clist.by/api/v4/contest/?start__gt={now_utc}&limit=100&format=json"
    headers = {
        "Authorization": f"ApiKey {USER}:{KEY}"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()

        contests = []
        for c in data["objects"]:
            site_name = c["resource"]
            if site_name in TOP_SITES:
                contests.append({
                    "event": c["event"],
                    "start": c["start"],
                    "end": c["end"],
                    "host": c["resource"],
                    "url": c["href"]
                })

        contests.sort(key=lambda x: x["start"])
        
        return contests

    except Exception as e:
        print("❌ Error fetching contests:", e)
        return []

# Alternative approach: If you want to show contests that are ongoing or upcoming
def fetch_contests_including_ongoing():
    now_utc = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S")
    
    url = f"https://clist.by/api/v4/contest/?end__gt={now_utc}&limit=100&format=json"
    headers = {
        "Authorization": f"ApiKey {USER}:{KEY}"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()

        contests = []
        current_time = datetime.utcnow()
        
        for c in data["objects"]:
            site_name = c["resource"]
            if site_name in TOP_SITES:
                start_time = datetime.fromisoformat(c["start"].replace('Z', '+00:00'))
                end_time = datetime.fromisoformat(c["end"].replace('Z', '+00:00'))
                
                if end_time > current_time:
                    contests.append({
                        "event": c["event"],
                        "start": c["start"],
                        "end": c["end"],
                        "host": c["resource"],
                        "url": c["href"],
                        "status": "ongoing" if start_time <= current_time else "upcoming"
                    })

        contests.sort(key=lambda x: x["start"])
        
        return contests

    except Exception as e:
        print("❌ Error fetching contests:", e)
        return []

def test_fetch():
    print("🔍 Fetching upcoming contests...")
    contests = fetch_contests()
    
    if contests:
        print(f"✅ Found {len(contests)} upcoming contests:")
        for i, contest in enumerate(contests[:5], 1):  # Show first 5
            print(f"{i}. {contest['event']} - {contest['host']}")
            print(f"   Start: {contest['start']}")
            print(f"   End: {contest['end']}")
            print()
    else:
        print("❌ No contests found")

if __name__ == "__main__":
    test_fetch()