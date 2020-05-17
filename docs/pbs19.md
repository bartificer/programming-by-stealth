# PBS 19 of X – Some JavaScript Challenges

While recording [instalment 18](https://pbs.bartificer.net/pbs18/) of the [Programming by Stealth series](https://www.bartbusschots.ie/s/blog/programming-by-stealth/), I promised Allison some challenges to help listeners test and hone their understanding of the core JavaScript language. Since we’ve now covered pretty much the whole language in the series, it’s the perfect time to pause and consolidate that knowledge.

These challenges are designed to be run in the [PBS JavaScript Playground](https://www.bartbusschots.ie/pbsdemos/pbs-JavaScriptPlayground/). You may also find the [PBS JavaScript cheatsheet](https://www.bartbusschots.ie/pbsdemos/PBS-JS-CheatSheet.html) helpful.

## Matching Podcast Episode 449

Listen Along: Chit Chat Across the Pond Episode 449

<audio controls src="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_08_08.mp3">Your browser does not support HTML 5 audio 🙁</audio>

You can also <a href="http://media.blubrry.com/nosillacast/traffic.libsyn.com/nosillacast/CCATP_2016_08_08.mp3?autoplay=0&loop=0&controls=1" >Download the MP3</a>

## Challenge 1 – The 12 Times Tables

Using a loop of your choice, print the 12 times tables from 12 times 1 up to and including 12 times 12.

### Solution

```javascript
for(var i = 1; i <= 12; i++){
  pbs.say('12 x ' + i + ' = ' + (12 * i));
}
```

## Challenge 2 – The Fibonacci Series

Write code to print out the Fibonacci series of numbers, stopping after the numbers go above 1,000,000 (you may print one number that is above 1,000,000, but no more).

The first two numbers in the series are 0 and 1. After that, the next number in the series is the sum of the previous two numbers.

Build up your solution in the following way:

1.  Create an array named `fibonacci` with two initial values – 0, and 1.
2.  Write a `while` loop that will keep going until the value of the last element of the fibonacci array is greater than 1,000,000. Inside the `while` loop, do the following:
     1. Calculate the next Fibonacci number by adding the last two elements in the `fibonacci` array together.
     1. Add this new value to the end of the `fibonacci` array.
3.  Print the Fibonacci series, one element per line, by converting the `fibonacci` array into a string separated by newline characters.

### Solution

```javascript
var fibonacci = [0, 1];
while(fibonacci[fibonacci.length -1] < 1000000){
  var nextFib = fibonacci[fibonacci.length -1] + fibonacci[fibonacci.length -2];
  fibonacci.push(nextFib);
}
pbs.say(fibonacci.join('\n'));
```

## Challenge 3 – FizzBuzz

This is a total cliché, and very common as an interview question. It tests if a programmer understands programming basics like loops and conditionals.

Write a program that prints the numbers from 1 to 100. But for multiples of three, print “Fizz” instead of the number. For the multiples of five, print “Buzz”. For numbers which are multiples of both three and five, print “FizzBuzz”.

### Solution

```javascript
for(var i = 1; i <= 100; i++){
  // figure out of we are a special case or not
  if(i % 3 == 0 || i % 5 == 0){
    // we are a special case, so build up the string to say
    var theLine = '';
    if(i % 3 == 0){
      theLine += 'Fizz';
    }
    if(i % 5 == 0){
      theLine += 'Buzz';
    }
    pbs.say(theLine);
  }else{
    // we are not a special case, so print the number
    pbs.say(i);
  }
}
```

## Challenge 4 – Factorial

Write a function to calculate the factorial of an arbitrary number. Name the function `factorial`. It’s only possible to calculate the factorial of a whole number greater than or equal to zero. If an invalid input is passed, return `NaN`.

As a reminder, the factorial of 0 is 1, and the factorial of any positive number, `n`, is defined as `n` times the factorial of `n - 1`.

You can write your solution either using a loop of your choice or using recursion.

Test your function by calculating the factorial of the inputs in the PBS playground. If no inputs are set, print a message telling the user to enter numbers into the inputs.

Show/Hide Iterative Solution

```javascript
// -- Function --
// Purpose    : calculate the factorial of a number
// Returns    : A number (NaN if the input is invalid)
// Arguments  : 1) the number to calcualte the factorial of
// Throws     : NOTHING
// Notes      : This is an itterative (loop-based) solution
function factorial(n){
  // validate the input
  if(!String(n).match(/^\d+$/)){
    return NaN
  }

  // calculate the solution
  var ans = 1;
  for(var i = 1; i <= n; i++){
    ans *= i;
  }

  // return the solution
  return ans;
}

// Use the function on the inputs
var theInputs = pbs.inputs();
if(theInputs.length > 0){
  theInputs.forEach(function(ipt){
    pbs.say("The factorial of '" + ipt + "' is " + factorial(ipt));
  });
}else{
  pbs.say('Enter numbers in the inputs to calculate their factorial');
}
```

### Recursive Solution

```javascript
// -- Function --
// Purpose    : calculate the factorial of a number
// Returns    : A number (NaN if the input is invalid)
// Arguments  : 1) the number to calcualte the factorial of
// Throws     : NOTHING
// Notes      : This is a recursive solution
function factorial(n){
  // validate the input
  if(!String(n).match(/^\d+$/)){
    return NaN
  }

  // break out of the recursive loop if n is 0
  if(n == 0){
    return 1;
  }

  // make the recursive call
  return n * factorial(n - 1);
}

// Use the function on the inputs
var theInputs = pbs.inputs();
if(theInputs.length > 0){
  theInputs.forEach(function(ipt){
    pbs.say("The factorial of '" + ipt + "' is " + factorial(ipt));
  });
}else{
  pbs.say('Enter numbers in the inputs to calculate their factorial');
}
```

## Challenge 5 – Complex Numbers

Build a prototype to represent a complex number. In case you’re a little rusty on the details, [this page offers a really nice explanation of complex numbers](https://www.mathsisfun.com/numbers/complex-numbers.html). The prototype should be named `ComplexNumber`.

Build up your solution in the following way:

1.  Define a constructor function for your prototype (it must be named the same as the prototype we are building, i.e. `ComplexNumber`).

    1.  For now, the constructor will not take any arguments.
    2.  In the constructor, Initialise a key named `_real` to the value 0.
    3.  Also Initialise a key named `_imaginary` to the value 0.

    ### Partial Solution

    ```javascript
    // -- Function --
    // Purpose    : Constructor function for the ComplexNumber prototype
    // Returns    : NOTHING
    // Arguments  : NONE
    // Throws     : NOTHING
    // Notes      : Initialises the vlaue to 0 (no real or imaginary value)
    // See Also   : https://www.mathsisfun.com/numbers/complex-numbers.html
    function ComplexNumber(){
      this._real = 0;
      this._imaginary = 0;
    }
    ```

2.  Add a so-called accessor function to the prototype to get or set the real part of the complex number. Name the function `real`.

    1.  If no arguments are passed, the function should return the current value of the `_real` key.
    2.  If there is a first argument, make sure it’s a number. If it’s not, throw an error. If it is, set it as the value of the `_real` key, and return a reference to the current object (i.e. `this`). (This will enable a technique known as _function chaining_, which we’ll see in action shortly.)

    ### Partial Solution

    ```javascript
    // -- Function --
    // Purpose    : An accessor function for the real part of the complex number
    // Returns    : The current real part of the complex number if no arguments
    //              were passed, or, a reference to the current object if an
    //              argument was passed
    // Arguments  : 1) OPTIONAL - a new real value - must be a number
    // Throws     : An error on invalid arguments
    ComplexNumber.prototype.real = function(r){
      // if there were no arguments, just return the real value
      if(arguments.length == 0){
        return this._real;
      }

      // otherwise, validate the first argument
      if(isNaN(r)){
        throw new Error('Type missmatch - number required');
      }

      // store the new value
      this._real = r;

      // return a reference to the current object
      return this;
    };
    ```

3.  Create a similar accessor function for the imaginary part of the complex number, and name it `imaginary`.

    ### Partial Solution

    ```javascript
    // -- Function --
    // Purpose    : An accessor function for the imaginary part of the complex number
    // Returns    : The current imaginary part of the complex number if no arguments
    //              were passed, or, a reference to the current object if an argument
    //              was passed
    // Arguments  : 1) OPTIONAL - a new imaginary value - must be a number
    // Throws     : An error on invalid arguments
    ComplexNumber.prototype.imaginary = function(i){
      // if there were no arguments, just return the real value
      if(arguments.length == 0){
        return this._imaginary;
      }

      // otherwise, validate the first argument
      if(isNaN(i)){
        throw new Error('Type missmatch - number required');
      }

      // store the new value
      this._imaginary = i;

      // return a reference to the current object
      return this;
    };
    ```

4.  Add a function to the prototype named `toString`. This function should return a string representation of the complex number. The rendering should adhere to the following rules:

     1. In the general case, where both real and imaginary parts are non-zero, return a string of the following form: `'(2 + 3i)'`. If the imaginary number is negative, change the `+` to a `-`.
     2. If the imaginary part is exactly 1, just show it as `i`.
     3. If either of the parts are equal to zero, omit the parentheses.
     4. If the real and imaginary parts are both zero, just return the string `'0'`.
     5. If only the imaginary part is zero, return just the real part as a string.
     6. If only the real part is zero, return just the imaginary part as a string followed by the letter `i`.

    ### Partial Solution

    ```javascript
    // -- Function --
    // Purpose    : Render a complex number as a string
    // Returns    : A string
    // Arguments  : NONE
    // Throws     : NOTHING
    ComplexNumber.prototype.toString = function(){
      // see if we are normal case (no zero involved)
      if(!(this._real == 0 || this._imaginary == 0)){
        // we are a regular case
        var ans = '('; // start with the opening perens
        ans += this._real; // append the real part
        if(this._imaginary < 0){ // append the appropraite separator symbol
          ans += ' - ';
        }else{
          ans += ' + ';
        }
        // append the imaginary number if it is not 1 or -1
        // since the + or - is already printed, force it to be positive
        // with Math.abs()
        if(Math.abs(this._imaginary) != 1){
          ans += Math.abs(this._imaginary);
        }
        ans += 'i)'; // append the i and end the final perens

        // return the assembled answer
        return ans;
      }

      // if we got here, we are a special case, so deal with each possible one in turn

      // deal with the case where both are zero
      if(this._real == 0 && this._imaginary == 0){
        return '0';
      }

      // deal with the case where only the real part is zero
      if(this._real == 0){
        var ans = ''; // start with an empty string
        // add the imaginary part if it is not 1 or -1
        if(Math.abs(this._imaginary) != 1){
          ans += this._imaginary;
        }
        // add a - sign if the imaginary part is exactly -1
        if(this._imaginary == -1){
          ans += '-';
        }
        ans += 'i'; // append the i
        return ans;
      }

      // if we got here, then the imaginary part must be zero
      return String(this._real); // force to a string
    };
    ```

5.  Test what you have so far with the following code:

    ```javascript
    //
    // === Test the toString() and Accessor functions ===
    //

    // create a complex number, set its values, and print it
    var cn1 = new ComplexNumber(); // construct a ComplexNumbr object
    cn1.real(2); // set the real part to 2
    cn1.imaginary(3); // set the imaginary part to 3
    pbs.say(cn1.toString()); // print it

    // create a second complex number, using 'function chianing' to do it all at once
    // NOTE: function chaining is only possible becuase both accessor functions return
    //       the special value this when they are used as setters.
    var cn2 = (new ComplexNumber()).real(2).imaginary(-4);
    pbs.say(cn2);

    // create some more complex number, but don't bother to save them, just print them
    pbs.say((new ComplexNumber()).real(-5.5).imaginary(1));
    pbs.say((new ComplexNumber()).real(7).imaginary(-1));
    pbs.say((new ComplexNumber()).real(2).imaginary(-6));
    pbs.say((new ComplexNumber()).real(-3));
    pbs.say((new ComplexNumber()).real(21));
    pbs.say((new ComplexNumber()).imaginary(-1));
    pbs.say((new ComplexNumber()).imaginary(1));
    pbs.say((new ComplexNumber()).imaginary(4.7));
    ```

6.  Add a function named `parse` to the `ComplexNumber` prototype to update the value stored in the calling complex number object. This function should allow the new value be specified in a number of different ways. The following should all work:

    1.  Two numbers as arguments – first the real part, then the imaginary part.
    2.  An array of two numbers as a single argument – the first element in the array being the real part, the second the imaginary part.
    3.  A string of the form `(a + bi)` or `(a - bi)` where `a` is a positive or negative number, and `b` is a positive number.
    4.  An object with the prototype `ComplexNumber`.

    ### Partial Solution

    ```javascript
    // -- Function --
    // Purpose    : Set the value of a complex number object
    // Returns    : A reference to the object
    // Arguments  : 1) the real part as a number
    //              2) the imaginary part as a number
    //                  --OR--
    //              1) an array of two numbers, first the real
    //                 part, the the imaginary part
    //                  --OR--
    //              1) an imaginary number as a string
    //                  --OR--
    //              1) a ComplexNumber object
    // Throws     : An error on invalid args
    ComplexNumber.prototype.parse = function(){
      // deal with each valid argument combination one by one
      if(typeof arguments[0] === 'number' && typeof arguments[1] === 'number'){
        // the two-number form of arguments
        this._real = arguments[0];
        this._imaginary = arguments[1];
      }else if(arguments[0] instanceof Array){
        // the one-array form of arguments
        if(typeof arguments[0][0] === 'number' && typeof arguments[0][1] === 'number'){
          this._real = arguments[0][0];
          this._imaginary = arguments[0][1];
        }else{
          throw new Error('invalid arguments');
        }
      }else if(typeof arguments[0] === 'string'){
        // the one-string form of arguments
        var matchResult = arguments[0].match(/^[(]([-]?\d+([.]\d+)?)[ ]([+-])[ ](\d+([.]\d+)?)i[)]$/);
        if(matchResult){
          this._real = parseFloat(matchResult[1]);
          this._imaginary = parseFloat(matchResult[4]);
          if(matchResult[3] == '-'){ // make the imaginary part negative if needed
            this._imaginary = 0 - this._imaginary;
          }
        }else{
          throw new Error('invalid arguments');
        }
      }else if(arguments[0] instanceof ComplexNumber){
        // the one-complex-number-object form of the arguments
        this._real = arguments[0].real();
        this._imaginary = arguments[0].imaginary();
      }else{
        // the arguments are not valid, so whine
        throw new Error('invalid arguments');
      }

      // return a reference to the object
      return this;
    }
    ```

7.  Test the parse function you just created with the following code:

    ```javascript
    //
    // === Test the Parse() function ===
    //

    var cn3 = new ComplexNumber(); // construct a ComplexNumbr object
    pbs.say(cn3.toString());

    // test the two-number form
    cn3.parse(2, 4);
    pbs.say(cn3.toString());

    // test the one array form
    cn3.parse([-3, 5.5]);
    pbs.say(cn3.toString());

    // test the one string form
    cn3.parse("(2 + 6i)");
    pbs.say(cn3.toString());
    cn3.parse("(2 - 6i)");
    pbs.say(cn3.toString());
    cn3.parse("(-2.76 + 6.2i)");
    pbs.say(cn3.toString());

    // test the one complex number object form
    var cn4 = (new ComplexNumber()).real(3).imaginary(4);
    cn3.parse(cn4);
    pbs.say(cn3.toString());
    ```

8.  Update your constructor so that it can accept the same arguments as the `.parse()` function. Do not copy and paste the code. Instead, update the constructor function to check if there are one or two arguments. If there are, call the `parse` function with the appropriate arguments.

    ### Partial Solution

    ```javascript
    // -- Function --
    // Purpose    : Constructor function for the ComplexNumber prototype
    // Returns    : NOTHING
    // Arguments  : If no arguments are passed, the complex number
    //              defaults to 0. If one or two arguments are passed
    //              they get passed on to .parse()
    // Throws     : An error if invalid arguments are passed
    // Notes      : A good explanation of imaginary numbers:
    //              https://www.mathsisfun.com/numbers/complex-numbers.html
    // See Also   : the .parse() function belonging to this prototype
    function ComplexNumber(){
      // set the default values on all data keys
      this._real = 0;
      this._imaginary = 0;

      // if there were arguments, deal with them
      if(arguments.length == 1){
        this.parse(arguments[0]);
      }else if(arguments.length == 2){
        this.parse(arguments[0], arguments[1]);
      }
    }
    ```

9.  Test your updated constructor with the following code:

    ```javascript
    //
    // === Test the Updated Constructor ===
    //

    // test the two-number form
    pbs.say( (new ComplexNumber(1, 2)).toString() );

    // test the one array form
    pbs.say( (new ComplexNumber([2, 3])).toString() );

    // test the one string form
    pbs.say( (new ComplexNumber("(2 - 6i)")).toString() );

    // test the one complex number object form
    var cn5 = new ComplexNumber(-2, -4);
    pbs.say( (new ComplexNumber(cn5)).toString() );
    ```

10. Add a function named `add` to the `ComplexNumber` prototype which accepts one argument, a complex number object, and adds it to the object the function is called on. Note that you add two complex numbers by adding the real parts together, and adding the imaginary parts together.

    ### Partial Solution

    ```javascript
    // -- Function --
    // Purpose    : Add another complex number to the object
    // Returns    : A reference to the object
    // Arguments  : 1) a complex number object
    // Throws     : An error on invalid arguments
    ComplexNumber.prototype.add = function(cn){
      // validate the argument
      if(!(cn instanceof ComplexNumber)){
         throw new Error('invalid arguments');
      }

      // do the maths
      this._real += cn.real();
      this._imaginary += cn.imaginary();

      // return a reference to the object
      return this;
    }
    ```

11. In a similar vain, add function named `subtract` to the `ComplexNumber` prototype. You subtract complex numbers by subtracting the real and imaginary parts.

    ### Partial Solution

    ```javascript
    // -- Function --
    // Purpose    : Subtract another complex number from the object
    // Returns    : A reference to the object
    // Arguments  : 1) a complex number object
    // Throws     : An error on invalid arguments
    ComplexNumber.prototype.subtract = function(cn){
      // validate the argument
      if(!(cn instanceof ComplexNumber)){
         throw new Error('invalid arguments');
      }

      // do the maths
      this._real -= cn.real();
      this._imaginary -= cn.imaginary();

      // return a reference to the object
      return this;
    }
    ```

12. Add a function named `multiplyBy` to the `ComplexNumber` prototype. The rule for multiplying complex numbers is, appropriately enough, quite complex. It can be summed up by the following rule:

    `(a+bi) x (c+di) = (ac−bd) + (ad+bc)i`

    ### Partial Solution

    ```javascript
    // -- Function --
    // Purpose    : Sultiply another complex number into the object
    // Returns    : A reference to the object
    // Arguments  : 1) a complex number object
    // Throws     : An error on invalid arguments
    ComplexNumber.prototype.multiplyBy = function(cn){
      // validate the argument
      if(!(cn instanceof ComplexNumber)){
         throw new Error('invalid arguments');
      }

      // split out the a, b, c & d parts for the rule
      var a = this.real();
      var b = this.imaginary();
      var c = cn.real();
      var d = cn.imaginary();

      // calcualte and store the results
      this._real = (a * c) - (b * d);
      this._imaginary = (a * d) + (b * c);

      // return a reference to the object
      return this;
    };
    ```

13. Add a function named `conjugateOf` to the `ComplexNumber` prototype. This function should return a new ComplexNumber object with the sign of the imaginary part flipped. I.e. `2 + 3i` becomes `2 - 3i` and _vice-versa_.

    ### Partial Solution

    ```javascript
    ComplexNumber.prototype.conjugateOf = function(){
      // if the imaginary part is positive, make a new CN with a negative version
      if(this.imaginary() &gt; 0){
        return new ComplexNumber(this.real(), 0 - this.imaginary());
      }

      // otherwise, the imaginary part was negative or 0, so use the absolute value
      return new ComplexNumber(this.real(), Math.abs(this.imaginary()));
    };
    ```

14. Test your arithmetic functions with the following code:


    ```javascript
    //
    // === Test the Arithmentic Functions ===
    //

    // create a complex number to manipulate
    var myCN = new ComplexNumber(1, 2);
    pbs.say(myCN);

    // add 4 + 2i to our number
    myCN.add(new ComplexNumber(4, 2));
    pbs.say(myCN);

    // subtract 2 + i from our number
    myCN.subtract(new ComplexNumber(2, 1));
    pbs.say(myCN);

    // set the value to 3 + 2i
    myCN.parse(3, 2);

    // multiply by 1 + 7i
    myCN.multiplyBy(new ComplexNumber(1, 7));
    pbs.say(myCN.toString()); // should be -11 + 23i

    // get the conjugate
    myCN = myCN.conjugateOf();
    pbs.say(myCN.toString());

    // get the conjugate again
    myCN = myCN.conjugateOf();
    pbs.say(myCN.toString());
    ```

### Completed Prototype

```javascript
//
// === Define the ComplexNumber Prototype ===
//

// -- Function --
// Purpose    : Constructor function for the ComplexNumber prototype
// Returns    : NOTHING
// Arguments  : If no arguments are passed, the complex number
//              defaults to 0. If one or two arguments are passed
//              they get passed on to .parse()
// Throws     : An error if invalid arguments are passed
// Notes      : A good explanation of imaginary numbers:
//              https://www.mathsisfun.com/numbers/complex-numbers.html
// See Also   : the .parse() function belonging to this prototype
function ComplexNumber(){
  // set the default values on all data keys
  this._real = 0;
  this._imaginary = 0;

  // if there were arguments, deal with them
  if(arguments.length == 1){
    this.parse(arguments[0]);
  }else if(arguments.length == 2){
    this.parse(arguments[0], arguments[1]);
  }
}

// -- Function --
// Purpose    : An accessor function for the real part of the complex number
// Returns    : The current real part of the complex number if no arguments
//              were passed, or, a reference to the current object if an
//              argument was passed
// Arguments  : 1) OPTIONAL - a new real value - must be a number
// Throws     : An error on invalid arguments
ComplexNumber.prototype.real = function(r){
  // if there were no arguments, just return the real value
  if(arguments.length == 0){
    return this._real;
  }

  // otherwise, validate the first argument
  if(isNaN(r)){
    throw new Error('Type missmatch - number required');
  }

  // store the new value
  this._real = r;

  // return a reference to the current object
  return this;
};

// -- Function --
// Purpose    : An accessor function for the imaginary part of the complex number
// Returns    : The current imaginary part of the complex number if no arguments
//              were passed, or, a reference to the current object if an argument
//              was passed
// Arguments  : 1) OPTIONAL - a new imaginary value - must be a number
// Throws     : An error on invalid arguments
ComplexNumber.prototype.imaginary = function(i){
  // if there were no arguments, just return the real value
  if(arguments.length == 0){
    return this._imaginary;
  }

  // otherwise, validate the first argument
  if(isNaN(i)){
    throw new Error('Type missmatch - number required');
  }

  // store the new value
  this._imaginary = i;

  // return a reference to the current object
  return this;
};

// -- Function --
// Purpose    : Render a complex number as a string
// Returns    : A string
// Arguments  : NONE
// Throws     : NOTHING
ComplexNumber.prototype.toString = function(){
  // see if we are normal case (no zero involved)
  if(!(this._real == 0 || this._imaginary == 0)){
    // we are a regular case
    var ans = '('; // start with the opening perens
    ans += this._real; // append the real part
    if(this._imaginary < 0){ // append the appropraite separator symbol
      ans += ' - ';
    }else{
      ans += ' + ';
    }
    // append the imaginary number if it is not 1 or -1
    // since the + or - is already printed, force it to be positive
    // with Math.abs()
    if(Math.abs(this._imaginary) != 1){
      ans += Math.abs(this._imaginary);
    }
    ans += 'i)'; // append the i and end the final perens

    // return the assembled answer
    return ans;
  }

  // if we got here, we are a special case, so deal with each possible one in turn

  // deal with the case where both are zero
  if(this._real == 0 && this._imaginary == 0){
    return '0';
  }

  // deal with the case where only the real part is zero
  if(this._real == 0){
    var ans = ''; // start with an empty string
    // add the imaginary part if it is not 1 or -1
    if(Math.abs(this._imaginary) != 1){
      ans += this._imaginary;
    }
    // add a - sign if the imaginary part is exactly -1
    if(this._imaginary == -1){
      ans += '-';
    }
    ans += 'i'; // append the i
    return ans;
  }

  // if we got here, then the imaginary part must be zero
  return String(this._real); // force to a string
};

// -- Function --
// Purpose    : Set the value of a complex number object
// Returns    : A reference to the object
// Arguments  : 1) the real part as a number
//              2) the imaginary part as a number
//                  --OR--
//              1) an array of two numbers, first the real
//                 part, the the imaginary part
//                  --OR--
//              1) an imaginary number as a string
//                  --OR--
//              1) a ComplexNumber object
// Throws     : An error on invalid args
ComplexNumber.prototype.parse = function(){
  // deal with each valid argument combination one by one
  if(typeof arguments[0] === 'number' && typeof arguments[1] === 'number'){
    // the two-number form of arguments
    this._real = arguments[0];
    this._imaginary = arguments[1];
  }else if(arguments[0] instanceof Array){
    // the one-array form of arguments
    if(typeof arguments[0][0] === 'number' && typeof arguments[0][1] === 'number'){
      this._real = arguments[0][0];
      this._imaginary = arguments[0][1];
    }else{
      throw new Error('invalid arguments');
    }
  }else if(typeof arguments[0] === 'string'){
    // the one-string form of arguments
    var matchResult = arguments[0].match(/^[(]([-]?\d+([.]\d+)?)[ ]([+-])[ ](\d+([.]\d+)?)i[)]$/);
    if(matchResult){
      this._real = parseFloat(matchResult[1]);
      this._imaginary = parseFloat(matchResult[4]);
      if(matchResult[3] == '-'){ // make the imaginary part negative if needed
        this._imaginary = 0 - this._imaginary;
      }
    }else{
      throw new Error('invalid arguments');
    }
  }else if(arguments[0] instanceof ComplexNumber){
    // the one-complex-number-object form of the arguments
    this._real = arguments[0].real();
    this._imaginary = arguments[0].imaginary();
  }else{
    // the arguments are not valid, so whine
    throw new Error('invalid arguments');
  }

  // return a reference to the object
  return this;
};

// -- Function --
// Purpose    : Add another complex number to the object
// Returns    : A reference to the object
// Arguments  : 1) a complex number object
// Throws     : An error on invalid arguments
ComplexNumber.prototype.add = function(cn){
  // validate the argument
  if(!(cn instanceof ComplexNumber)){
     throw new Error('invalid arguments');
  }

  // do the maths
  this._real += cn.real();
  this._imaginary += cn.imaginary();

  // return a reference to the object
  return this;
};

// -- Function --
// Purpose    : Subtract another complex number from the object
// Returns    : A reference to the object
// Arguments  : 1) a complex number object
// Throws     : An error on invalid arguments
ComplexNumber.prototype.subtract = function(cn){
  // validate the argument
  if(!(cn instanceof ComplexNumber)){
     throw new Error('invalid arguments');
  }

  // do the maths
  this._real -= cn.real();
  this._imaginary -= cn.imaginary();

  // return a reference to the object
  return this;
};

// -- Function --
// Purpose    : Sultiply another complex number into the object
// Returns    : A reference to the object
// Arguments  : 1) a complex number object
// Throws     : An error on invalid arguments
ComplexNumber.prototype.multiplyBy = function(cn){
  // validate the argument
  if(!(cn instanceof ComplexNumber)){
     throw new Error('invalid arguments');
  }

  // split out the a, b, c & d parts for the rule
  var a = this.real();
  var b = this.imaginary();
  var c = cn.real();
  var d = cn.imaginary();

  // calcualte and store the results
  this._real = (a * c) - (b * d);
  this._imaginary = (a * d) + (b * c);

  // return a reference to the object
  return this;
};

// -- Function --
// Purpose    : Return a new object which is the conjugate of the one this function is called on
// Returns    : A ComplexNumber object
// Arguments  : NONE
// Throws     : NOTHING
ComplexNumber.prototype.conjugateOf = function(){
  // if the imaginary part is positive, make a new CN with a negative version
  if(this.imaginary() > 0){
    return new ComplexNumber(this.real(), 0 - this.imaginary());
  }

  // otherwise, the imaginary part was negative or 0, so use the absolute value
  return new ComplexNumber(this.real(), Math.abs(this.imaginary()));
};
```
