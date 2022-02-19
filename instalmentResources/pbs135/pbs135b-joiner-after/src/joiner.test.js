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
 test('Default  Join', ()=>{
    // typical case - joins with an & when passed a regular list of strings
    expect(joiner().join(['a', 'b', 'c'])).toBe('a, b & c');

    // edge case - empty array
    expect(joiner().join([])).toBe('');

    // edge case - one string
    expect(joiner().join(['a'])).toBe('a');

    // edge case - two strings
    expect(joiner().join(['a', 'b'])).toBe('a & b');

    // invalid data - not an array
    expect(()=>{joiner().join('pancakes')}).toThrow(TypeError);
 });

 //
 // === Test the modifiers ===
 //

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