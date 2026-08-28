function add(a: number, b: number) {
  return a + b;
}

describe('test the test :>>', () => {
  test('a + b', () => {
    expect(add(1, 2)).toBe(3);
  });
});
