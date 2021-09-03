# import time
# import pycom
# import machine

# # from SI7006A20 import SI7006A20
# # from LTR329ALS01 import LTR329ALS01
# # from MPL3115A2 import MPL3115A2,ALTITUDE,PRESSURE

# # pycom.heartbeat(False)
# # pycom.rgbled(0x0A0A08) # white


# # alt = MPL3115A2(py,mode=ALTITUDE) # Returns height in meters. Mode may also be set to PRESSURE, returning a value in Pascals
# # print("MPL3115A2 temperature: " + str(alt.temperature()))
# # print("Altitude: " + str(alt.altitude()))
# # pres = MPL3115A2(py,mode=PRESSURE) # Returns pressure in Pa. Mode may also be set to ALTITUDE, returning a value in meters
# # print("Pressure: " + str(press.pressure()))
# # # send to pybytes


# # dht = SI7006A20(py)
# # print("Temperature: " + str(dht.temperature())+ " deg C and Relative Humidity: " + str(dht.humidity()) + " %RH")
# # print("Dew point: "+ str(dht.dew_point()) + " deg C")
# # #change to your ambient temperature
# # t_ambient = 24.4
# # print("Humidity Ambient for " + str(t_ambient) + " deg C is " + str(dht.humid_ambient(t_ambient)) + "%RH")


# # li = LTR329ALS01(py)
# # print("Light (channel Blue lux, channel Red lux): " + str(li.light()))


from LIS2HH12 import LIS2HH12
from pycoproc import Pycoproc
py = Pycoproc()

acc = LIS2HH12(py)


# print("Battery voltage: " + str(py.read_battery_voltage()))

# from network import WLAN
# wlan = WLAN()

# wlan.init(mode=WLAN.AP, ssid='hello world')
# #use the line below to apply a password
# #wlan.init(ssid="hi", auth=(WLAN.WPA2, "eightletters"))
# print(wlan.ifconfig(id=1)) #id =1 signifies the AP interface

# print(wlan.wifi_packet())

# https://docs.pycom.io/tutorials/networkprotocols/webserver/

import usocket
import _thread
import time
from network import WLAN
import pycom
import json

availablecolor = 0x001100
connectioncolor = 0x110000

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

    http = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection:close \r\n\r\n" #HTTP response
    
    if "GET / " in str(r):
        #this is a get response for the page   
        # Sends back some data
        print("sending data")
#         print("Acceleration: " + str(acc.acceleration()))
# print("Roll: " + str(acc.roll()))
# print("Pitch: " + str(acc.pitch()))
        # print(type(acc.acceleration()))
        clientsocket.send(http+json.dumps(acc.acceleration()))
    elif "GET /hello "in str(r):
        
        clientsocket.send(http + "<html><body><h1> Hello to you too! </h1><br> <a href='/'> go back </a></body></html>")
    elif "GET /color" in str(r):
        pycom.rgbled(0xFFFFFF)
        clientsocket.send(http + "<html><body><h1> You are connection "+ str(n) + "</h1><br> Your browser will send multiple requests <br> <a href='/hello'> hello!</a><br><a href='/color'>change led color!</a></body></html>")

    # Close the socket and terminate the thread

    clientsocket.close()
    pycom.rgbled(connectioncolor)
    time.sleep_ms(500)
    pycom.rgbled(availablecolor)  

time.sleep(1)
wifi = WLAN()
wifi.init(mode=WLAN.AP, ssid="hello", auth=None, channel=1)
print("WiFi is up!")
time.sleep(1)
pycom.heartbeat(False)
pycom.rgbled(availablecolor)

# Set up server socket
serversocket = usocket.socket(usocket.AF_INET, usocket.SOCK_STREAM)
serversocket.setsockopt(usocket.SOL_SOCKET, usocket.SO_REUSEADDR, 1)
serversocket.bind(("192.168.4.1", 80))

# Accept maximum of 5 connections at the same time
serversocket.listen(5)

# Unique data to send back
c = 1
while True:
    # Accept the connection of the clients
    (clientsocket, address) = serversocket.accept()
    # Start a new thread to handle the client
    _thread.start_new_thread(client_thread, (clientsocket, c))
    c = c+1
serversocket.close()