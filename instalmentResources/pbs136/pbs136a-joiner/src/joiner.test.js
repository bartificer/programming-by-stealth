import joiner from "./joiner.mjs";

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
  
  test('with invalid data', ()=>{
    expect(()=>{joiner().join('pancakes')}).toThrow(TypeError);
  });
});

//
// === Test the modifiers ===
//

describe('test modifiers', ()=>{
  test('ampersand modifier', ()=>{
    expect(joiner().ampersand.join(['a', 'b', 'c'])).toBe('a, b & c');
  });
  test('and modifier', ()=>{
    expect(joiner().and.join(['a', 'b', 'c'])).toBe('a, b and c');
  });
  test('or modifier', ()=>{
    expect(joiner().or.join(['a', 'b', 'c'])).toBe('a, b or c');
  });
  test('single quote modifier', ()=>{
    expect(joiner().quote.join(['a', 'b', 'c'])).toBe("'a', 'b' & 'c'");
  });
  test('double quote modifier', ()=>{
    expect(joiner().doubleQuote.join(['a', 'b', 'c'])).toBe('"a", "b" & "c"');
  });
  test('sort modifier', ()=>{
    expect(joiner().sort.join(['a', 'c', 'b'])).toBe('a, b & c');
  });
});