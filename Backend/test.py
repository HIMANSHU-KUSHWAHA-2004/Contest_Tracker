import requests

def fetch_contests():
    url = (
        "https://clist.by/api/v4/contest/"
        "?username=Himanshu_Kushwaha"
        "&api_key=6fc01dae72a250c6941e04ead5cc61342c08a23a"
        "&format=json"
        "&start_time__gte=now"
        "&order_by=start"
        "&timezone=Asia/Kolkata"
    )

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return data["objects"]
    except Exception as e:
        print("❌ Error fetching contests:", e)
        return []
