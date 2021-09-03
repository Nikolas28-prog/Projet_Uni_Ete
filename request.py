import requests
import sys

# sys.stdout=open('declare.js','w')
URL = "http://192.168.4.1"

while(True):
    r = requests.get(url = URL)
    file = open('declare.js','w')
    file.write("var xyz = "+r.text)
    file.close()


#print(r.status_code)
