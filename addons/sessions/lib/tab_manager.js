"use strict";

const {Session} = require("session");
const {Helpers} = require("helpers");
const tabs = require("tabs");
const timers = require("timers");

let TabManager = function() {
    for each(let tab in tabs) {
        createTabSession.call(this, tab);
    }
    tabs.on("open", createTabSession);
    tabs.on("activate", setActiveTab);
    tabs.on("ready", onTabReady.bind(this));
};
TabManager.prototype = {
    constructor: TabManager,
    sessionsUpdate: function(tab, data) {
       tab.sessions = data.sessions;
       this._resetSession = false;
    },
    sessionReset: function(tab) {
        // console.log("session reset");
        this._resetSession = true;
    }
};

function createTabSession(tab) {
    if(!tab.session) {
        let model = Session();
        tab.__defineGetter__('session', function() { return model; });
        tab.__defineGetter__('sessions', function() { return model.sessions; });
        tab.__defineSetter__('sessions', function(sessions) { model.sessions = sessions; });
        setActiveTab(tab);
    }
}

function setActiveTab(tab) {
    //console.log("new tab made active");
    tab.window.session = tab.session;
}

function onTabReady(tab){
  if(this._resetSession) {
      tab.session.noInfo();
  }
}

exports.TabManager = TabManager;
