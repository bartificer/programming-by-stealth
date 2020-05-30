# PBS 97 of X — Class Data Attributes & Functions

In this instalment we'll be introducing the penultimate concept for this series-within-a-series on Object Oriented programming in JavaScript.

Before we move forward, let's take a moment to summarise where we've gotten to.

We have learned to use classes to allow us to construct concrete examples of abstract concepts. Each concrete example taking the form of an encapsulated object — that is to say, an object that contains both data, and, the functions to manipulate that data. We call these encapsulated objects *instances* of the class that constructed them. Because the data attributes and functions are encapsulated within each instance, we refer to them as *instance data attributes*, and *instance functions*.

Instance attributes and functions are accessed using the dot notation on instances of a class, so it's `someInstance.someAttribute` or `someInstance.someFunction()`.

Instance attributes are designed to hold information that is unique to each instance, and instance functions are designed to operate on a specific instance's data. What if you have some data that is relevant to all instances of a class, but does not vary from instance to instance? Or what if you have functions that are related to the abstract concept a class represents, but not applicable to a single instance of the class. Where where should such data and functions go?

## Class Data Attributes & Functions (in Any OO Language)

Well, if something is better associated with the abstract concept that with individual instances, they should be added to the class, not encapsulated into the instances. Rather unimaginatively, we refer to data attributes associated directly with a class as *class data attributes*, and functions associated directly with a class as *class functions*. Perhaps a little too imaginatively, many programmers also refer to class data attributes and class functions as *static data attributes*, and *static functions*, and many languages use the keyword `static` to mark an attribute or function as belonging to the class.

**Class data attributes and class functions do not get encapsulated into instance of a class**, this means they cannot be accessed via an instance of the class. Class data attributes and functions are instead accessed via the class, i.e. `SomeClass.someData` and `SomeClass.someFunction()`.

Instance data attributes get be initialised by a class's constructor function(s). Many languages support so-called **static initialiser. functions** to initialise class data attributes as the class gets loaded for the first time. However, this is not a universal concept, so in some languages you need to work around that limitation in less elegant ways (spoiler — JavaScript is one of those languages 🙁).

If this all sounds a little too abstract, let's consider a class to represent circles again (like we did in the previous instalment). The value of Pi is clearly associated with the concept of a circle, but is it a property that varies from circle to circle? No it is not! It's a single value that all circles have in common. This means it should be added as a class data attribute, not an instance data attribute (like we did in the previous instalment).

Similarly, a function for testing whether of not a given value is a reference to an instance of our circle class is clear related to our circle class. However, it would make no sense to add it as an instance function, because it would not be encapsulated into anything that was not an instance of our class! Clearly, this should be a class function.

## Class Data Attributes & Functions in JavaScript — The `static` Keyword

Let's move from a generic description of the concept that applies to any OO language and focus in on how JavaScript implements class data attributes and functions.  Remember that in this series-within-a-series we're confining ourselves to the modern JavaScript OO syntax. Before ES6 things were done very differently, but we're ignoring that history.

From our ES6 and beyond point of view, the correct way to add class data attributes is with getters and setters.

**To mark a getter or setter as being for a class data attribute** rather than an instance data attribute, simply **pre-fix the declaration with the keyword `static`**.

Similarly, **to mark a function defined within a class as being a class function** rather than an instance function, simply **pre-fix the declaration with the keyword `static`**.

Because the keyword `static` is used to mark attributes and functions as belonging to the class, many developers use *static data attribute* as a synonym for *class data attribute*, and *static function* as a synonym for *class function*.

### Initialising Class Data Attributes in JavaScript

As mentioned above, JavaScript does not support static initialisers. This gives us two choices for how we initialise class data attributes:

1. Initialise the class variables after the class definition.
2. Write your getters in such a way that they gracefully deal with the current value being `undefined`, and behave appropriately.

Let's see what the first approach looks like in a very simplified example:

```js
class A{
  static get b(){
    return this._b;
  }
  static set b(b){
    this._b = b;
  }
}
this._b = 0; // initialise after class
```

And the same simplified example using one possible variant of the second approach:

```js
class A{
  static get b(){
     // conditionally initialise in getter
    if(typeof this._b === undefined) this._b = 0;
    return this._b;
  }
  static set b(b){
    this._b = b;
  }
}
```

And here is another:

```js
class A{
  static get b(){
    // don't initialise, have a default value instead
    return typeof this._b === undefined ? 0 : this._b ;
  }
  static set b(b){
    this._b = b;
  }
}
```

The first approach separates the initialisation from the class definition, so is only viable if you always define your classes in separate files, adding the initialisation code at the bottom of the file (after you close the `class` statement). Using a separate file is the only way to reliably insure the initialisation code won't get separated from the class definition when you share your class between projects or with others.

I prefer to keep all the code for my classes within the `class` statement, so I prefer (and recommend) some variant of the second approach. That's what I'll be doing in this series.

### The Keyword `this` Within Class (AKA Static) Functions

We've already learned that within instance functions the keyword `this` is a reference to *the instance object I belong to*. Similarly, within class functions, the keyword `this` is a reference to *the class I belong to*. This means that class functions can access other class functions and class data attributes using `this`.

### Accessing Class Functions from Within Instance Functions

In JavaScript, every object constructed by a constructor, i.e. every instance of any class, automatically gets an instance data attribute named `constructor`. This automatically created data attribute will be a reference to the class the object is an instance of. That means that within instance functions, the class they belong to can be accessed with `this.constructor`. Since class data attributes belong to the class, they can be accessed via `this.constructor.someClassAttribute`. Similarly, class functions can be accessed via `this.constructor.someClassFunction()`.

## A Worked Example — the `Nerdtouche` Class

This all sounds very abstract, so let's create a worked example — a class to represent a modern-day nerd-equivalent of the [cartouches](https://en.wikipedia.org/wiki/Cartouche) ancient Egyptian pharos used. The names of pharos were recorded in inscriptions as groups of pictograms encapsulated in a pill-shaped grouping.

In my imagination, a modern nerd equivalent would be a grouping of three emoji a person uses to represent themselves — I've decided to call them *Nerdtouches* 🙂

Since my biggest nerd loves are science, computing, and photography, I've chosen (🔭🖥️📷) as mine.

Let's build a class to represent this nutty invention of mine.

We'll start with a basic implementation of the idea. You'll find the full code for this first pass at the problem in the file `Nerdtouche1.js`, and you can interact with the class via the JavaScript console on `pbs97a.html`.

Note that this class assumes it will be used on pages where the following third-party libraries have been loaded:

1. [jQuery](https://jquery.com)
2. [Bootstrap 4](https://getbootstrap.com)
3. [is.js](https://is.js.org)
4. [grapheme-splitter](https://github.com/orling/grapheme-splitter/) (more on this in a moment)

### A Class Function

Let's start by laying a useful foundation — a function for testing if a given value is a single emoji. This functionality is clearly related to the set of all Nerdtouches, and not specific to any given Nerdtouche, so it should be added as a class function.

Emoji are not characters in the traditional sense, they are Unicode graphemes, and because Unicode is ... well ... Unicode, that means you can't use string length to test for the presence of a single grapheme. You can prove this to yourself using the JavaScript console on any web page:

```js
'⛔'.length // 1
'💩'.length // 2
'🤦🏼‍'.length // 5
```
It's also really hard to tell which unicode grapheme is an emoji, and which is some other symbol, so I made two decisions:

1. For the purposes of this class, any single grapheme will count as an emoji.
2. I won't even try to write my own code for counting graphemes in a string, I'll use a third-party library.

After a little Googling I decided to use [grapheme-splitter](https://github.com/orling/grapheme-splitter/) which provides exactly the function I need — `.countGraphemes()`!

```js
class Nerdtouche{

  // …

  static isEmoji(val){
    if(is.not.string(val)){
      return false;
    }
    return (new GraphemeSplitter()).countGraphemes(val) === 1;
  }
	
  // …
}
```

Because we pre-fixed the function definition with the `static` keyword we access our function via the class, not via an instance, so this function is `Nerdtouche.isEmoji()`. We can see this function in action on the JavaScript console in `pbs97a.html`:

```
Nerdtouche.isEmoji('💩') // true
Nerdtouche.isEmoji('🐎💩') // false
```

### A Read-only Class Data Attribute

Next let's add a read-only class data attribute to provide access to the number of emoji that make up a Nerdtouche:

```js
class Nerdtouche{

  // …

  static get length(){
    return 3;
  }

  static set length(l){
    throw new Error(`Nerdtouches will always be ${this.length} emoji long!`);
  }
	
  // …
}
```

The only difference between this read-only class data attribute and a read-only instance data attribute is that both the getter and setter are pre-fixed with the keyword `static`.

We can see this property in action in the console:

```js
Nerdtouche.length // 3
Nerdtouche.length = 4 // throws Error
```

### Read/Write Class Data Attributes

Next let's add a pair of class data attributes to store editable default values for the user's handle and the emoji.

```js
class Nerdtouche{

  // …

  static get defaultHandle(){
    return this._defaultHandle || 'Some Nerd';
  }
  static set defaultHandle(h){
    if(is.not.string(h)) throw new TypeError('Default Handle must be a string');
    if(is.empty(h)) throw new RangeError("Default Handle can't be an empty string");
    this._defaultHandle = e;
  }

  static get defaultEmoji(){
    return this._defaultEmoji || '⁉️';
  }
  static set defaultEmoji(e){
    if(is.not.string(e)) throw new TypeError('Default Emoji must be a string');
    if(!this.isEmoji(e)) throw new RangeError('Default Emoji must be a single Unicode character');
    this._defaultEmoji = e;
  }
  
  // …
}
```

There are two things I want to draw your attention to in these short getters and setters. Firstly, both use the approach of having the getter return a default value to work around JavaScript's lack of support for static initialisers. Secondly, the setter for the default emoji calls the class function `isEmoji()` using the `this` keyword.

### Two Instance Data Attributes

With the class functions and data attributes taken care of, let's move on to the instance data attributes — there are just two of them, one for the handle, and one for the set of emoji:

```js
class Nerdtouche{

  // …

  get handle(){
    return this._handle;
  }
  set handle(h){
    if(is.not.string(h)) throw new TypeError('Handle must be a string');
    if(is.empty(h)) throw new RangeError('Handle cannot be an empty string');
    this._handle = h;
  }
	
  get emoji(){
    return [...this._emoji] // shallow clone with spread opperator
  }
  set emoji(e){
    const errMsg = `emoji must be an array of ${this.constructor.length} single Unicode graphemes`;
    if(is.not.array(e) || !is.all.string(e)){
      throw new TypeError(errMsg);
    }
    for(const emoji of e){
      if(!this.constructor.isEmoji(emoji)){
        throw new RangeError('each emoji must be a single Unicode graphemes');
      }
    }
    if(e.length < this.constructor.length){
      throw new TypeError(errMsg);
    }
    this._emoji = e.slice(0, this.constructor.length);
  }
  
  // …
}
```

The getter and setter for the handle are very much by-the-book, but the setter for the emoji warrants a closer look.

The first thing to notice is that this instance getter access the class function `isEmoji()` and the class data attribute `length` using the `this.constructor` syntax.

Secondly, note that the function avoid hard-coding the number of emoji by making use of the `length` class data attribute. We know that the setter for this class data attribute prevents users of the class from altering this value, but that's no reason to hard-code the value in this getter. By making use of the read-only  `length` class attribute I'm making it easy for myself to change my mind on the length later. Should I decide some day that Nerdtouches should be 4 emoji long, I just have to edit a single line of code!

Finally, notice the use of the `Array`  instance function `.slice()` to do a small amount of data coercion – the setter throws an error if passed too few emoji, but truncates any excess of emoji to just the required number.

### The Constructor

Next, there is of course a constructor which we can use to build actual Nerdtouche instances:

```js
class Nerdtouche{

  // …

  constructor(handle, ...emoji){
    // set defaults if needed
    if(is.undefined(handle)) handle = this.constructor.defaultHandle;
    while(emoji.length < this.constructor.length){
      emoji.push(this.constructor.defaultEmoji);
    }
		
    // store the instance data
    this.handle = handle; // could throw error
    this.emoji = emoji; // could throw error
  }
  
  // …
}
```

This is pretty much by-the-book, but again, notice the use of `this.constructor` to access class data attributes. Also notice the use of default values to make all arguments to the constructor optional, and the use of the spread operator to bundle all arguments after the first one into an array named `emoji`.

Finally, we have some instance functions for rendering our Nerdtouche in various formats — plain text, as an HTML string, and as a jQuery object — and a function to append a Nerdtouche into a desired part of the document:

```js
class Nerdtouche{

  // …

  asString(){
   return `(${this.emoji.join('')})`;
  }
	
  as$(){
    const $nerdtouche = $('<span>').html(this.emoji.join('<br>'));
    $nerdtouche.attr('title', this.handle);
    $nerdtouche.addClass('nerdtouche badge badge-secondary badge-pill p-1 m-1 align-middle');
    $nerdtouche.css({
      fontSize: '0.5em',
      lineHeight: 1.5
    });
    return $nerdtouche;
  }
	
  asHTML(){
    return this.as$()[0].outerHTML;
  }
	
  appendTo($container){
    if(is.not.object($container) || !$container.jquery){
      throw new TypeError('the container must be a jQuery object');
    }
    $container.append(this.as$());
  }
  
  // …
}
```

This is all very much by-the-book, making use of various standard JavaScript and jQuery functions we've seen many times throughout this series. The only new addition is the use of the fact that all jQuery objects have an instance data attribute named `jquery` to quickly and easily test whether or not an object is a jQuery object. This is in keeping with [jQuery's developer documentation](https://api.jquery.com/jquery-2/).

TO DO — Show the class in action!!!

## Connecting Objects to the DOM Elements

In the web environment it's quite normal for instances of your classes to map to one or more elements in the DOM. If you're writing a class to represent a world clock, you'll need to display that clock on the page! Similarly, the whole point of a class to represent Nerdtouches is to embed them into web pages.

I can often be very useful to create a two-way connection between our instance objects and the DOM objects representing them to the user. There is no single correct approach to this, and many possible approaches you could take.

At the moment our Nerdtouche class provides no linkage at all between instances of the class and the DOM objects built by those instances. Let's add such linkages as a means of illustrating some useful concepts and approaches.

With something like a world clock you would have a clear one-to-one mapping between instance objects and DOM objects, but Nerdtouches are different. There's no one-to-one mapping because each Nerdtouche can be included into the document arbitrarily many times.

The final code for our updated Nerdtouche class can be found in the file `Nerdtouche2.js`, and you can interact with this class via the JavaScript console on the file `pbs97b.html`.

### Unique IDs or Classes

When you have a one-to-one mapping between instance objects and DOM objects you can use unique IDs to allow each instance to find it's one matching DOM element. 

When you have a many-to-one mapping you can't use IDs, but you can uses classes, which is what we'll do in our worked example.

However, regardless of whether you use a unique ID or class, you're left with the same fundamental problem — how do you reliably generate unique identifiers?

My preferred solution is to add a counter to the class as a class data attribute. You can safely allow public read access to this counter, but you should prevent users from changing the value of the counter. Instead, the counter should get updated only by the constructor.

Let's add such a counter to our class:

```js
class Nerdtouche{

  // …

  static get count(){
    return this._count || 0;
  }
  static set count(c){
    throw new Error('Only the constructor may update the counter!');
  }
  
  constructor(handle, ...emoji){
    // …
    
    // increment the instance counter and store the sequence number
    this.constructor._count = this.constructor.count + 1;
    this._sequenceNumber = this.constructor.count;
  }
  
  // …
}
```

So, we have a class data attribute named `count` that gets incremented each time a new instance is created, and, each instance stores the value of the count when it was created as the private instance data attribute `_sequenceNumber`.

We can now use this to generate unique class names for each instance by adding an instance data attribute named `uniqueClass`, and injecting it into the jQuery objects built by the `.as$()` instance function:

```js
class Nerdtouche{

  // …

  get uniqueClass(){
    return `nerdtouche-${this._sequenceNumber}`;
  }
	
  set uniqueClass(uc){
    throw new Error("Nerdtouche's unique classes can't be changed");
  }
  
  as$(){
    // …
	
	$nerdtouche.addClass(this.uniqueClass);
	
	// …
  }
  
  // …
}
```

We can now see that the HTML or each Nerdtouche contains a different class:

```js
const bart = new Nerdtouche('bartificer', '🔭', '🖥', '📷');
const allison = new Nerdtouche('podfeet', '🐕', '🖥', '🚘');
console.log(bart.asHTML());
console.log(allison.asHTML());
```

### DOM-Storing Data Attributes

TO DO — LEFT OFF HERE

### DOM-searching Class & Instance Functions

TO DO

### Data Attributes

TO DO