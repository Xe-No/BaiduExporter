function sendToBackground(method, data, callback) {
    chrome.runtime.sendMessage({
        method: method,
        data: data
    }, callback);
};

function HttpSend(info) {
    Promise.prototype.done = Promise.prototype.then;
    Promise.prototype.fail = Promise.prototype.catch;
    return new Promise(function (resolve, reject) {
        var http = new XMLHttpRequest();
        var contentType = "\u0061\u0070\u0070\u006c\u0069\u0063\u0061\u0074\u0069\u006f\u006e\u002f\u0078\u002d\u0077\u0077\u0077\u002d\u0066\u006f\u0072\u006d\u002d\u0075\u0072\u006c\u0065\u006e\u0063\u006f\u0064\u0065\u0064\u003b\u0020\u0063\u0068\u0061\u0072\u0073\u0065\u0074\u003d\u0055\u0054\u0046\u002d\u0038";
        var timeout = 3000;
        if (info.contentType != null) {
            contentType = info.contentType;
        }
        if (info.timeout != null) {
            timeout = info.timeout;
        }
        var timeId = setTimeout(httpclose, timeout);
        function httpclose() {
            http.abort();
        }
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if ((http.status == 200 && http.status < 300) || http.status == 304) {
                    clearTimeout(timeId);
                    if (info.dataType == "json") {
                        resolve(JSON.parse(http.responseText), http.status, http);
                    }
                    else if (info.dataType == "SCRIPT") {
                        // eval(http.responseText);
                        resolve(http.responseText, http.status, http);
                    }
                }
                else {
                    clearTimeout(timeId);
                    reject(http, http.statusText, http.status);
                }
            }
        };
        http.open(info.type, info.url, true);
        http.setRequestHeader("Content-type", contentType);
        var h;
        for (h in info.headers) {
            if (info.headers[h]) {
                http.setRequestHeader(h, info.headers[h]);
            }
        }
        if (info.type == "POST") {
            http.send(info.data);
        }
        else {
            http.send();
        }
    });
};

function showToast(message, type) {
    window.postMessage({ type: "show_toast", data: { message: message, type: type } }, "*");
}

function copyText(text) {
    var input = document.createElement("textarea");
    document.body.appendChild(input);
    input.style.position = "fixed";
    input.style.left = "0";
    input.style.top = "0";
    input.value = text;
    input.focus();
    input.select();
    var result = document.execCommand("copy");
    input.remove();
    console.log(result);
    if (result)
        showToast("拷贝成功~", "MODE_SUCCESS");
    else
        showToast("拷贝失败 QAQ", "MODE_FAILURE");
}