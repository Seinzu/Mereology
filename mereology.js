// Mereology.js a very minimal OO helper framework
// Currently very feature light (semi-deliberately)
// Copyright (c) 2012 Andrew Rumble
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to
// whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var Mereology;
/**
 * Mereology exposes two main types of objects, a Model and a View. These are (very) loosely based on the separation of
 * concerns in backbone.js.
 * A View is designed to keep presentation elements up to date
 * A Model attempts to gather the information from various HTML elements (and potentially external sources)
 * @type {*}
 */
Mereology = (function () {
    var Mereology;
    // Helper function based on Crockford's for testing if an object is an array
    function isArray(a) {
        return Object.prototype.toString.apply(a) === "[object Array]";
    }
    // Create the object
    Mereology = {};
    // Setting a version number
    Mereology.VERSION = 0.1;
    // A couple of helper functions - These are loosely based on how CoffeeScript handles inheritance (which is similar
    // to how Google do in turn).
    // A reference to hasOwnProperty to make extension work better
    Mereology.__hasProperty = Object.prototype.hasOwnProperty;
    // Causes a delinked copy of all properties in the second named object to the first named object (where the property
    // is native to the second named object).
    Mereology.__extends = function (child, parent) {
        var prop;
        for (prop in parent) {
            if (Mereology.__hasProperty.call(parent, prop)) {
                child[prop] = parent[prop];
            }
        }
        function Ctor() {
            this.constructor = child;
        }

        Ctor.prototype = parent.prototype;
        child.prototype = new Ctor;
        child.__super__ = parent.prototype;
        return child;
    };
    /**
     *
     * @type {*}
     */
    Mereology.Model = (function () {

        function Model() {
            var event, self, targetItem, currentEvent;
            self = this;
            this.eventListeners = {};
            for (event in this.events) {
                currentEvent = this.events[event];
                if (currentEvent.hasOwnProperty("event")) {
                    if (currentEvent.hasOwnProperty("target")) {
                        targetItem = $(currentEvent.target);
                    }
                    else {
                        targetItem = $(this.element);
                    }
                    targetItem.bind(currentEvent.event, {event:event, callback:currentEvent.callback}, function (e) {
                        self.handleEvent(e);
                    });
                }
            }
        }

        Model.prototype.handleEvent = function (e) {
            var currentListener, listener, callback, event;
            event = e.data.event;
            callback = e.data.callback;
            callback.apply(this, arguments);
            // Handle all of the attached listeners
            for (listener in this.eventListeners[event]) {
                currentListener = this.eventListeners[event][listener];
                callback = currentListener.c;
                callback.apply(currentListener.o, arguments);
            }
        };

        /**
         * Register that the given view/object wants to be updated when a given event happens
         * @param event The name of the event (the name for the event in the model's events property)
         * @param observer The object to be provided as context (using apply) normally the object from the callback
         * @param callback The function to be called
         */
        Model.prototype.listen = function (event, observer, callback) {
            if (isArray(this.eventListeners[event])) {
                this.eventListeners[event].push({o:observer, c:callback});
            }
            else {
                this.eventListeners[event] = new Array({o:observer, c:callback});
            }
        };

        return Model;

    })();

    Mereology.View = (function () {

        function View(el) {
            this.el = $(el);
            this.selector = el;
            this.render();
        }

        View.prototype.refreshElement = function () {
            this.el = $(this.selector);
        };

        View.prototype.render = function () {
          // do nothing by default
        };

        return View;

    })();

    return Mereology;

})();
