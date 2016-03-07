/* global chrome, console */
"use strict";
window.addEventListener("load", init);

/*
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        console.log(details.url);
        if (details.url == "http://agar.io/main_out.js?555")
            return {
                redirectUrl: "http://wikilist.daniguardiola.me/agario.js"
            };
    }, {
        urls: ["<all_urls>"]
    }, ["blocking"]);
*/

function init() {
    checkVersion();
}

function openPopup(url) {
    chrome.tabs.create({
        "url": url
    });
}

function checkVersion() {
    var landingUrl = "http://pageedit.daniguardiola.me/?installed=true";
    var version = chrome.runtime.getManifest().version;
    var updatedUrl;
    chrome.storage.local.get("versionNumber", function(storage) {
        var versionNumber = storage.versionNumber;
        if (!versionNumber) {
            openPopup(landingUrl);
        } else if (versionNumber !== version) {
            updatedUrl = updatedUrl = "http://pageedit.daniguardiola.me/#changes?update=true&version=" + version;
            openPopup(updatedUrl);
        }
        chrome.storage.local.set({
            "versionNumber": version
        });
    });

}

var API = {};
API.msg = (function() {
    // Send message to background page
    function send(message, callback) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, message, {}, callback);
        });

        /*
        chrome.tabs.query({
            currentWindow: true
        }, function(result) {
            console.log(result);
        });
        chrome.tabs.getCurrent(function(tab) {
            console.log(tab);
        });
        */
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

// Route requests
function router(request) {
    if (request) {
        console.log(request);
    }
}

// Initialize background page
function init() {
    API.msg.listen(router);
}
window.addEventListener("load", init);

var on = false;
chrome.browserAction.onClicked.addListener(function() {
    var command = on ? "stop" : "start";
    on = !on;
    API.msg.send({
        command: command
    });
});
