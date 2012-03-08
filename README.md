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
done by using the _events_ property on the Model object like so:

    this.events = {
        eventReferrent: {
            event:"click",
            target:$('#someElement'),
            callback:this.test
        }
    };

You can [see this in context](http://jsfiddle.net/GEzKK/) below:

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
            ExampleModel.__super__.constructor.apply(this, arguments);
        }

        ExampleModel.prototype.test = function () {
            alert("click event fired");
        }

        return ExampleModel;

    })(Mereology);
    $(document).ready(function () {
        model = new ExampleModel();
    });

The text that goes where _eventReferrent_ is now should be a unique name for the event, this will be used later by View
objects. The _event_ property is the name of the jQuery event that should be listened for, the rules for the bind() function
should be obeyed when filling this in. The _target_ property can be omitted if you have set the _element_ property on the
model, this will be the default target. The _callback_ property will tell the event handler what function to launch when
the event occurs.

### View ###

A View is designed to handle one specific page element.

#### Listening ####

A view will generally handle updating the display to reflect changes that have been detected by the various Model objects
that you have deployed. The general method for achieving this is to listen for events on the model and attach a callback.
Using the example above we could set up a listener for the _eventReferent_ event like this:
    model.listen("eventReferent", view, view.test);
Where _view_ is the variable that our new View has been assigned to, [see below in context](http://jsfiddle.net/GEzKK/2/):

    ...

    var ExampleView = (function(m){

        m.__extends(ExampleView, m.View);

        function ExampleView () {
            ExampleView.__super__.constructor.apply(this, arguments);
        }

        ExampleView.prototype.test = function () {
            this.el.html("Button pressed");
        };

        return ExampleView;

    })(Mereology);

    $(document).ready(function () {
            var model, view;
            model = new ExampleModel();
            view = new ExampleView($("#status"));
            model.listen("eventReferent", view, view.test);
    });