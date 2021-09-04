from LIS2HH12 import LIS2HH12 #acc
from pycoproc import Pycoproc
import usocket
import _thread
import time
from network import WLAN
import pycom
import json

py = Pycoproc()

acc = LIS2HH12(py)

def normalize(value):
    if (value > 0.1):
        return 0.1
    elif (value < -0.1):
        return -0.1
    else:
        return 0

# http = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection:close\r\n Access-Control-Allow-Origin: *\r\n\r\n" #HTTP response
header="""HTTP/1.0 200 OK
Content-Type: text/html; charset=utf-8
Access-Control-Allow-Origin: *

"""

# Thread for handling a client
def client_thread(clientsocket,n):
    # Receive maxium of 12 bytes from the client
    r = clientsocket.recv(4096)

    # If recv() returns with 0 the other end closed the connection
    if len(r) == 0:
        clientsocket.close()
        return
    else:
        # Do something wth the received data...
        print("Received: {}".format(str(r))) #uncomment this line to view the HTTP request

    if "GET / " in str(r):
        print("sending data")
        clientsocket.send(header)
        clientsocket.send(json.dumps([normalize(x) for x in acc.acceleration()]))
    
    # Close the socket and terminate the thread
    clientsocket.close()

time.sleep(1)
wifi = WLAN()
wifi.init(mode=WLAN.AP, ssid="hello", auth=None, channel=1)
print("WiFi is up!")
time.sleep(1)
pycom.heartbeat(False)

# Set up server socket
serversocket = usocket.socket(usocket.AF_INET, usocket.SOCK_STREAM)
serversocket.setsockopt(usocket.SOL_SOCKET, usocket.SO_REUSEADDR, 1)
serversocket.bind(("192.168.4.1", 80))

# Accept maximum of 1 connections at the same time
serversocket.listen(1)

# Unique data to send back
c = 1
while True:
    # Accept the connection of the clients
    (clientsocket, address) = serversocket.accept()
    # Start a new thread to handle the client
    _thread.start_new_thread(client_thread, (clientsocket, c))
    c = c+1
serversocket.close()