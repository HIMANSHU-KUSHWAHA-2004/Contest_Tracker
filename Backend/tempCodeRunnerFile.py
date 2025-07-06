import requests

USERNAME = "Himanshu_Kushwaha"
API_KEY = "6fc01dae72a250c6941e04ead5cc61342c08a23a"

def fetch_contests():
    url = "https://clist.by/api/v4/contest/?upcoming=true&limit=20&format=json"

    headers = {
        "Authorization": f"ApiKey {USERNAME}:{API_KEY}"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()

        contests = []
        for c in data["objects"]:
            contests.append({
                "event": c["event"],
                "start": c["start"],
                "end": c["end"],
                "host": c["resource"],
                "url": c["href"]
            })

        return contests

    except Exception as e:
        print("❌ Error fetching contests:", e)
        return []
