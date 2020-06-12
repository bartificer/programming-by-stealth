# PBS 98 of X — Building with Classes Part 1 — *Has-A*

I had promised that this instalment would focus on the very important concept of *inheritance*, but as I started to try write the notes I realised we need to build some more context before we're ready for that final piece of the object orientation puzzle.

Both this instalment and the next, when we will finally meet inheritance, share a theme — using individual classes as building blocks for larger abstractions. We've said that classes allow us to represent things or or concepts in code, well, things and concepts interact with each other to form larger systems, and so do classes!

Regardless of the app you're building, the chances are high it will require representing more than a single concept or thing. If you're writing a note-taking app you may only need a few classes, perhaps one to represent notes, and one to represent folders. But, if you're writing a game you're very likely to need tens, or even hundreds of classes — just think about all the characters, things, and concepts that fill a virtual world!

In the object-oriented world view classes can be related in one of two ways.

Firstly, classes can have instances of another classes as properties — a class to represent a forest will definitely contain some instances of a class representing trees, and probably some instances of a class representing wild flowers too, and perhaps even some instances of a class representing bears! We call this a *has-a* relationship, and this is the type of relationship we'll be focusing on in this instalment.

Secondly, classes can be more specific versions of others. A class to represent Poodles is a more specific version of a class to represent a generic dog. We call this an *is-a* relationship, and those will be the focus of the next instalment, because the mechanism for implementing this kind of relationship is inheritance.

The *has-a* relationship really is very simple to describe — instances of one class have instances of another as properties — but that description is very wooly and abstract. To try put some flesh on those proverbial bones, the remainder of this instalment will take the form of a worked example consisting of three inter-related concepts, and hence, three inter-related classes.

## A Worked Example — Currency Amounts

Our ultimate aim in this worked example is to represent an amount of money. We'll achieve that goal by writing classes to represent three inter-related concepts — *amounts of money* will be in a given *currency*, and each currency will contain one or more *denominations*. For example, the sum of money $5.45 is in US Dollars which have two denominations, dollars and cents. We'll achieve our aim by building three classes `Denomination`, `Currency`, and `Monetary Amount`.

An amount of money has a currency, and a currency has denominations, so we have at least two *has-a* relationships to deal with here.