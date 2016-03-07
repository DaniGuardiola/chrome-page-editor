/* global console, chrome */
"use strict";
(function() {
    var API = {};
    API.msg = (function() {
        // Send message to background page
        function send(message, callback) {
            chrome.runtime.sendMessage(message, function(response) {
                console.log(response);
                callback(response);
            });
        }

        // Listen for messages from content script
        function listen(listener) {
            chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
                sendResponse(listener(request));
            });
        }

        return {
            send: send,
            listen: listen
        };
    }());

    function contentEditable(bool) {
        var body = document.body;
        if (bool) {
            body.setAttribute("contentEditable", true);
            body.setAttribute("spellcheck", false);
            body.spellcheck = false;
            body.focus();
            body.blur();
        } else {
            body.removeAttribute("contentEditable");
            body.removeAttribute("spellcheck");
        }
    }

    function start() {
        contentEditable(true);
    }

    function stop() {
        contentEditable(false);
    }

    API.msg.listen(function(request) {
        var cmd = request.command;
        if (cmd === "start") {
            start();
        } else if (cmd === "stop") {
            stop();
        }
    });

}());
