var x = 0
var y = 0
var button = false
var last_val = false;

function httpGetAsync() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            data = JSON.parse(xmlHttp.responseText)
            x = data[1]
            y = data[0]
            if (!last_val && data[3]&&!playing) {//rising edge
                button = true;
            }
            last_val = data[3]
            if(button){
                start()
                button=false;
                playing=true;
            }
        }
    }
    xmlHttp.open("GET", "http://192.168.4.1", true); // true for asynchronous 
    xmlHttp.send();
}

setInterval(httpGetAsync, 100)