function load(div, url) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if (xmlhttp.status == 200) {
               document.getElementById(div).innerHTML = xmlhttp.responseText;
           } else {
               document.getElementById(div).innerHTML = "Error";
           }
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}