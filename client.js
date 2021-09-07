var x = 0
var y = 0
var button = false
// setInterval(httpGetAsync, 100);

function httpGetAsync() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            data = JSON.parse(xmlHttp.responseText)
            x = data[1]
            y = data[0]
            button = data[3]

            // console.log(data)
        }
    }
    xmlHttp.open("GET", "http://192.168.4.1", true); // true for asynchronous 
    xmlHttp.send();
}

setInterval(httpGetAsync, 100)