# PBS 98 of X — Class Relationships

This instalment brings us to the end of our third pass at Object Oriented Programming. We've now gotten to a stage where we represent abstract concepts and ideas as JavaScript classes, and then use those classes to build concrete instances of those concepts or ideas. Each of those instances is an object that encapsulates both data and functions.

So far we've been dealing with single classes in isolation. Just like the real world is full of interacting concepts and ideas, so most Object Oriented programs are full of interacting classes. I like to think of classes as the bricks that object oriented apps are built with. Individual classes are useful, but collections of classes working together are infinitely more so!

For our purposes in this series, there are just two kinds of class relationship we care about — *is-a*, and *has-a*. Well start with the simpler *has-a* relationship before moving on to the extremely powerful *is-a*.

This entire instalment will be built around a worked example, and for it it, we'll be circling back to an idea we've played with a lot in recent instalments — currencies.

## What is a Currency?

That's not really the question actually — the real question is how we are going to model them!

From our point of view a currency will consist of one or more denominations, have a name and symbol, and be either real or imaginary.

Our implementation will allow us to model three distinct types of currency:

1. **Decimal currencies** like the ones we're used to in our daily lives. These have two denominations, and the smaller denominations divides into the larger by a power of ten, usually 100. The obvious examples would be the British Pound and Penny, and the American Dollar and Cent.
2. **Unitary currencies** like the Japanese Yen are currencies that have just one denomination.
3. **Multi-Denominational currencies** like Wizarding money in J.K. Rowling's Harry Potter universe. Wizard money comes in three denominations, and the ratios between them are definitely not factors of ten! Banking and shopping in the wizarding world are much more complicated than what we're used to because there are 17 Sickles in a Galleon and 29 Knuts in a Sickle!

Throughout this instalment we'll build a suite of classes that together will allow us to represent American Dollars, Euros, Monopoly money, Japanese Yen, Quatloos (a Uunitary currency from the Star Trek universe), Wizarding money, and Ferengi strips, slips, and bars of Gold-pressed Latinum.

## Step 1 — A Class to Represent Denominations

This class does not have a lot of work to do — it simply provides getters and setters for two properties (`name` & `symbol`), a constructor, and a `.clone()` instance function.

TO DO — INSERT CODE

## Step 2 — A Basic Class to Represent Currencies in General

Rather than trying to write one class that can handle all three currency types, let's start by creating a simple class that represents things all our currency types will have in common.

Again, this class doesn't have much to do just yet. For now it simply provides getters and setters for two real properties (`name` & `imaginary`), getters and setters for a virtual property `real` which is simply the inverse of `imaginary`, and a constructor.

TO DO — INSERT CODE

## Inheritance — the *is-a* Relationship

We now have a class that represents the things common to all currency types. We now need to write separate classes for each type of currency, but we want to do so without needless code duplication. What we really want is for each of our three classes to somehow absorb our `Currency` class. The mechanism for doing just that is *inheritance*.

When class `B` absorbs all the functionality from class `A` it's said to *inherit from* `A`. We can also say that `A`  is `B`'s *parent class*, and `B` is a *child class* of `A`.

We can also say that `B` *is an* `A`.

LEFT OFF HERE