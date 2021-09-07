var x=0
var y=0

// setInterval(httpGetAsync, 100);

function httpGetAsync()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          data=JSON.parse(xmlHttp.responseText)
          x=data[1]
          y=data[0]
          z=data[2]
          
            console.log(x)
        }
    }
    xmlHttp.open("GET", "http://192.168.4.1", true); // true for asynchronous 
    xmlHttp.send();
}

setInterval(httpGetAsync,100)