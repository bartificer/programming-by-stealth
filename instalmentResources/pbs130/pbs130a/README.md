# The S2XMas Module

A JavaScript Module providing a class for calculating the number of sleeps until Christmas, and rendering the result as a cute string.

The class is easy to use:

```
import S2XmasCalculator from 'S2XmasCalculator.class.mjs';
const calc = new S2XmasCalculator();
calc.printSleeps();
// prints: 28 sleeps 😴 till Christmas 🎄
```

You can also change the icons:

```
import S2XmasCalculator from 'S2XmasCalculator.class.mjs';
const calc = new S2XmasCalculator();
calc.sleepIcon = '💤';
calc.christmasIcon = '🎅';
calc.printSleeps();
// prints: 28 sleeps 💤 till Christmas 🎅
```

This class and these docs were written as a demo for [Instalment 130](https://pbs.bartificer.net/pbs130) of the Programming by Stealth series by [Bart Busschots](https://bartb.ie/) & [Allison Sheridan](https://podfeet.com).