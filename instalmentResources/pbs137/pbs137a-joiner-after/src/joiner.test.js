import joiner from "./joiner.js";

//
// === Module-level tests ===
//
test('Module exports expected value', ()=>{
   expect(joiner).toBeInstanceOf(Function);
});

//
// === Test Default Functionality ===
//
describe('test default join (no modifiers)', ()=>{
  describe.each([
    ['typical case - 3 arguments', ['a', 'b', 'c'], 'a, b & c'],
    ['edge case - empty array',    [],              ''        ],
    ['edge case - one string',     ['a'],           'a'       ],
    ['edge case - two strings',    ['a', 'b'],      'a & b'   ]
  ])('with valid data', (desc, input, result)=>{
    test(desc, ()=>{
      expect(joiner().join(input)).toBe(result);
    });
  });
  describe.each([
    ['string',         'pancakes'],
    ['number',         42],
    ['boolean',        true],
    ['plain object',   {a: 'b'}],
    ['class instance', new Date()]
  ])('with invalid data', (desc, val)=>{
    test(`with a ${desc}`, ()=>{
      expect(()=>{joiner().join(val)}).toThrow(TypeError);
    });
  });
});

//
// === Test the modifiers ===
//

describe('test modifiers', ()=>{
  let testArray;
  beforeAll(()=>{
    testArray = ['waffles', 'pancakes', 'popcorn'];
  });

  test('ampersand modifier', ()=>{
    expect(joiner().ampersand.join(testArray)).toBe('waffles, pancakes & popcorn');
  });
  test('and modifier', ()=>{
    expect(joiner().and.join(testArray)).toBe('waffles, pancakes and popcorn');
  });
  test('or modifier', ()=>{
    expect(joiner().or.join(testArray)).toBe('waffles, pancakes or popcorn');
  });
  test('single quote modifier', ()=>{
    expect(joiner().quote.join(testArray)).toBe("'waffles', 'pancakes' & 'popcorn'");
  });
  test('double quote modifier', ()=>{
    expect(joiner().doubleQuote.join(testArray)).toBe('"waffles", "pancakes" & "popcorn"');
  });
  test('sort modifier', ()=>{
    expect(joiner().sort.join(testArray)).toBe('pancakes, popcorn & waffles');
  });
});