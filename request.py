import requests

URL = "http://192.168.4.1"

while(True):
    r = requests.get(url = URL)
    print(r.json())


#print(r.status_code)
