export default function sum(a, b) {
  /* ваш код */
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("a and b should be numbers");
  }

  return a + b;
}
