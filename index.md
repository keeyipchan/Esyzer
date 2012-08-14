---
layout: main
title: ECMAScript analyzer
---

#Welcome to ESyzer home
This tool is targeted to parse and analyze a JavaScript programs. Mainly in OOP sense - this means what it will try
to find your classes, get the list of properties and methods, build an inheritance tree, and analyze a links between
defferent parts of application: creating of objects, accessing to properties of one object from another, and etc.

##Concept of JSObject

*JSObject* is the main structure element in analyze results. We can say what JSObject is the 'extended' JavaScript - level
object or name, which contains additional information. For example, in this code:

{% highlight javascript %}
var X = function () {
    this.p = 'I am a property of instance';
}
X.prototype.y = function () { console.log(this.p);}
X.meta = 'I am a property of class itself';
{% endhighlight %}

The `X` object will be created and marked as a class. Inside this object there is a property `instance`, which holds all
methods and properties. In example above `X` will be a class, `X.instance.p` will me a function and a method,
`X.instance.p` will be a property and `X.meta` will be property of the `X` itself.
And also each of them can contain references to appropriate nodes, links to other objects, etc.
This allows a very flexible analysis.

##Analysis

###Creation of objects, naming and type marking:
 - ![](images/done.png) Create scope chain
 - ![](images/done.png) Declare variable and names inside a scope
 - ![](images/done.png) Deanonimize of function expression by linking it to corresponding JSObject
{% highlight javascript %}
var a = function () {};// will link 'a' JSObject to function and viceversa
b=function () {};// the same will happen for 'b'
{% endhighlight %}

 - ![](images/done.png) Mark objects as a class on `new X()`, `this.property`, `X.prototype.f = ...`

###Linking between objects
 - ![](images/done.png) Trivial reference, set `ref` property of object to corresponding object on assigning
 - ![](images/done.png) Property-to-class, set `ref` on `this.x = new Class();`
 - ![](images/planned.png) Deep property linking: `this.x = new Class(); this.y = this.x.prop`

###Module handling
 - ![](images/done.png) CommonJS module support
 - ![](images/planned.png) Regular js-file module support
