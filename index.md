---
layout: main
title: ECMAScript analyzer
---

#Welcome to ESyzer home
This tool is targeted to parse and analyze a JavaScript programs. Mainly in OOP sense - this means what it will try
to find your classes, get the list of properties and methods, build an inheritance tree, and analyze a links between
defferent parts of application: creating of objects, accessing to properties of one object from another, and etc.

```ruby
require 'redcarpet'
markdown = Redcarpet.new("Hello World!")
puts markdown.to_html
```

###List of analys features:
 - ![](images/done.png) Create scope chain
 - ![](images/done.png) Declare variable and names inside a scope