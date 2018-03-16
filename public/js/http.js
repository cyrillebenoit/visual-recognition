class Http {
  constructor() {}

  get(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
  }

  post(url, params, callback) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function() { //Call a function when the state changes.
      if (http.readyState == 4 && http.status == 200) {
        callback(http.responseText);
      }
    }
    http.send(params);
  }
}

let http = new Http();
