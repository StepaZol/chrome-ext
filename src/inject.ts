console.log('adasd');
function interceptData() {
    console.log('interceptData');
    var xhrOverrideScript = document.createElement('script');
    xhrOverrideScript.type = 'text/javascript';
    xhrOverrideScript.innerHTML = `
  (function() {
    var XHR = XMLHttpRequest.prototype;
    var send = XHR.send;
    var open = XHR.open;
    XHR.open = function(method, url) {
        this.url = url; // the request url
        return open.apply(this, arguments);
    }
    XHR.send = function() {
        this.addEventListener('load', function() {
            if (this.url.includes('https://www.gosuslugi.ru/api/lk/v1/equeue/agg/slots')) {
                console.log("this.response",this.response)
            }               
        });
        return send.apply(this, arguments);
    };
  })();
  `
    document.head.prepend(xhrOverrideScript);
}
function checkForDOM() {
    if (document.body && document.head) {
        interceptData();
    } else {
        requestIdleCallback(checkForDOM);
    }
}
requestIdleCallback(checkForDOM)
