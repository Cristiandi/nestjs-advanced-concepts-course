function fib(n: number) {
  if (n < 2) return n;

  return fib(n - 1) + fib(n - 2);
}

module.exports = (n: number) => fib(n);
