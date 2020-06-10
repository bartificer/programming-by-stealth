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

