# PBS 93 of X — Encapsulation with JavaScript Objects

Since [instalment 84](https://bartificer.net/pbs84) we've been slowly making our way through all the different proverbial *hats* JavaScript objects wear. We started by reminding ourselves how JavaScript uses [objects as hashtables/dictionaries](https://bartificer.net/pbs84), then we looked at how [JavaScript uses objects to implement arrays](https://bartificer.net/pbs85). In [instalment 86](https://bartificer.net/pbs86) we looked at how [JavaScript functions are actually objects](https://bartificer.net/pbs86), and in [instalment 87](https://bartificer.net/pbs87) we we learned about Iterators, a new type of object added to JavaScript in ES6, and Generators, a related new type of function. In [Instalment 88](https://bartificer.net/pbs88) we reminded ourselves of how our browsers use objects to represent the structure of web pages using the DOM, and how jQuery objects give us a more developer-friendly way of interacting with the DOM. Next we learned about how [JavaScript provides wrapper-objects for the native types](https://bartificer.net/pbs90) (Boolean, String & Number), and finally, we learned about how [JavaScript uses objects to implement Regular Expressions](https://bartificer.net/pbs91).

This leaves just one proverbial *hat* to explore — JavaScript's rather unique use of objects to support object oriented programming. Because this is both an important and a somewhat complex topic, we're going to split it into two parts. In this instalment we'll focus on a core principle that forms the foundation of object oriented programming — *encapsulation*.

## The Problem Encapsulation Solves

At its most fundamental level, programming is about representing information and transforming it. The various types of variables allow us to store information, and functions allow us to transform or process that information.

In a simplistic script you might only be dealing with a single collection of related variables and functions that together represent a single concept. IT doesn't take long until that ceases to be true though. You very quickly find that your web apps have to represent multiple concepts, so you end with a handful of variables and functions that handle one concept, then another handful of variables and functions that deal with something else. The individual variables and functions that deal with any single concept are not related in any way. Looking at your code you just see a mix of variables and functions, and it gets very confusing very quickly. Sure, diligently following naming schemes and commenting your code can help add some order to the chaos, but surely, there must be a better way?

## The Concept of Encapsulation

Encapsulation is one of those core concepts of computer science that span languages. If a language supports object orientation, then it must implement encapsulation in some way.

All encapsulation must allow related variables and functions to be combined into a single entity that can represent both information, and the functions for processing or transforming that information.

Many programming languages go a step further, and include access control in their implementation of encapsulation. The idea being that some information can be labeled as purely internal or private, and that no functions outside the encapsulation can access such information.

Dictionaries are commonly used for encapsulation, especially in languages where functions, or references to functions, can be stored as the values within dictionaries.

## Encapsulation in JavaScript

Because JavaScript functions are objects, and hence, references to them can be stored in variables, we can implement basic encapsulation in JavaScript using objects with their dictionary hat on.

We can **store both information and references to functions as key/values pairs within JavaScript objects**.

Note that I described JavaScript's implementation of encapsulation as *basic* in this section's opening sentence. There's a good reason for that — **JavaScript's implementation of encapsulation does not provide any form of access control**. We won't encounter an implementation of that concept until we move on to PHP in future instalments.

<aside>
JavaSript's lack of support for encapsulation access control is one of the reasons C++ and Java programmers tend to look down on JavaScript and often refer to it pejoratively as a *toy language* or *just a scripting language*. When you come from a world where you can use keywords like `private` and `protected` to block access to internal variables, the idea that any script using your code can reach in and mess with any of your variables behind you back is horrifying — how can you write robust code if the developers using your API can tinker with all your variables behind your back?

Since Java was my first language, and hence, my introduction to encapsulation and object orientation focused heavily on access control, I too looked down my nose at JavaScript for a long time. I'm well and truly over my dumb prejudice now, but it took years, so I empathise with those who haven't yet seen the light 😉
</aside>

## A Simplistic Example

## The Importance of `this` for Encapsulation

TO DO