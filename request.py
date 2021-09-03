import requests
import sys
import time

URL = "http://192.168.4.1"

while(True):
    r = requests.get(url = URL)
    file = open('json.js','w')
    file.write("var xyz = "+r.text)
    file.close()
    time.sleep(0.033)