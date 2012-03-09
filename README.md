# Mereology #

>Mereology (from the Greek μερος, ‘part’) is the theory of parthood relations: of the relations of part to whole and the 
>relations of part to part within a whole.
>
> -- Varzi, Achille, "Mereology", The Stanford Encyclopedia of Philosophy (Spring 2011 Edition), Edward N. Zalta (ed.), URL = <http://plato.stanford.edu/archives/spr2011/entries/mereology/>. 

## Introduction ##

Mereology is a simple JavaScript helper object designed to abstract some of the functionality required for MVC. The basic concept
is to make a simpler version of Backbone.js that does not assume that you are building your whole application in JavaScript.
Mereology assumes that you are using jQuery.

## Usage ##

There are three types of thing provided in Mereology: Collections, Views and Models. They are intended to be used together.

The way to produce Views and Models is mostly uniform. First make an object, passing the Mereology object in:

    var ExampleThing = (function(m){

    ...

    })(Mereology);

Then use the built-in `__extends` function to say which Mereology thing you want to extend (Mereology uses Google style
inheritance):

    m.__extends(ExampleThing, m.Model)

or

    m.__extends(ExampleThing, m.View)

where the first argument is your new object and the second is the thing to extend.

The final step is to include a call to the parent in your constructor like so:

    function ExampleThing(){
        ExampleThing.__super__.constructor.apply(this, arguments);
    }

Now, you can do the specific things that are required for the type of thing that you wanted to make.

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

You can [see this in context](http://jsfiddle.net/seinzu/Md69D/1/) below:

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
        }ListItem

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

A View is designed to handle one specific page element. This should be passed to the View at initialisation, like so:

    view = new ExampleView($("#status"));

or:

    view = new ExampleView("#status");

This should be the element that you will be updating. You can use a member function called render in order to update the
DOM for the element that the View controls.

#### Listening ####

A view will generally handle updating the display to reflect changes that have been detected by the various Model objects
that you have deployed. The general method for achieving this is to listen for events on the model and attach a callback.
Using the example above we could set up a listener for the _eventReferent_ event like this:

    model.listen("eventReferent", view, view.test);

Where _view_ is the variable that our new View has been assigned to, [see below in context](http://jsfiddle.net/seinzu/Md69D/2/):

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

### Collection ###

Collections are just basically a bunch of models all stuffed together into a big thing (you could make them a
bunch of whatever you want but the idea is that you pop your models in there). As they are generally a glorified array
you will quite often find yourself just using the base class rather than extending it (although you are obviously welcome
to do that):

    var collection = new Mereology.Collection($("li"), ExampleModel);

You may have noticed that there are two arguments when instantiating the _Collection_ object. The first is basically any
array of objects (or a single object operating as a hash) that can be iterated over using the `jQuery.each()` function, in
the example this is a jQuery object containing (presumably) many li elements. This argument denotes the items that will be
added to the collection. This argument is sort of optional in that you can also call the member function _addMembers_ to
add an array of items to the _Collection_.

    var collection = new Mereology.Collection({}, ExampleModel);
    collection.addMembers($("li"));

The second argument is a constructor or a callback that will be wrapped around the members of the array provided in the first argument.
If nothing is supplied here then the members will be left as they are. The intention though is that you provide a model.
The model constructor will be passed the element as its first argument so it is best to write your Model in this way:

    var ExampleModel = (function (m) {
        m.__extends(ExampleModel, m.Model);

        function ExampleModel(el){
            this.element = $(el);
            ...
            ExampleModel.__super__.constructor.apply(this, arguments);
        }

        ...

    })(Mereology);

