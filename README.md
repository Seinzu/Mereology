# Mereology #

## Introduction ##

Mereology is a simple JavaScript helper object designed to abstract some of the functionality required for MVC. The basic concept
is to make a simpler version of Backbone.js that does not assume that you are building your whole application in JavaScript.
Mereology assumes that you are using jQuery.

## Usage ##

There are two types of thing provided in Mereology: Views and Models. They are intended to be used together.

### Model ###

Just like in any version of MVC a Model is designed to capture information about aspects of the objects that your
application makes use of.

#### Events ####

One of the main concerns that Mereology models have is harvesting information from the page and storing it internally.
This is generally achieved using events; when an event occurs on the page, callbacks that are associated with that event
are fired on the model. One of the first configuration tasks that should be undertaken is defining these events. This is
done by using the "events" property on the Model object like so:

    this.events = {
        eventReferrent: {
            event:"click",
            target:$('#someElement'),
            callback:this.test
        }
    };

You can see this in context below:

    var ExampleModel = (function(m){

        m.__extends(ExampleModel, m.Model);

        function ExampleModel () {
            this.events = {
                    eventReferrent: {
                        event:"click",
                        target:$('#someElement'),
                        callback:this.test
                    }
                };
        }

        ExampleModel.prototype.test = function () {
            alert("click event fired");
        }

    })(Mereology);

    model = new ExampleModel();

The text that goes where "eventReferrent" is now should be a unique name for the event, this will be used later by View
objects. The "event" property is the name of the jQuery event that should be listened for, the rules for the bind() function
should be obeyed when filling this in. The "target" property can be omitted if you have set the "element" property on the
model, this will be the default target. The "callback" property will tell the event handler what function to launch when
the event occurs.

### View ###