(function() {
    let assertionCallback;

    self.port.on("assertionReady", function(payload) {
        if(assertionCallback) {
            assertionCallback(payload.assertion);
        }
    });

    self.port.on("assertionFailure", function(payload) {
        if(assertionCallback) {
            assertionCallback(null);
        }
    });

    var nav = unsafeWindow.navigator;
    nav.id = nav.id || {};
    nav.id.getVerifiedEmail = function(callback) {
        assertionCallback = callback;
        var loc = window.location;

        var origin = loc.protocol + "//" + loc.host;
        self.port.emit("getAssertion", {
            host: origin
        });
    };

}());