import requests
import sys

sys.stdout=open('declare.js','w')
URL = "http://192.168.4.1"

while(True):
    r = requests.get(url = URL)
    print("var xyz = "+r.text)


#print(r.status_code)
