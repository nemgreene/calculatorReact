const addition = (x, y) => parseFloat(x) + parseFloat(y);
const subtraction = (x, y) => parseFloat(x) - parseFloat(y);
const multiplication = (x, y) => parseFloat(x) * parseFloat(y);
const division = (x, y) => parseFloat(x) / parseFloat(y);
const percentage = (x, y) => (parseFloat(x) / 100) * parseFloat(y);
const exponent = (x) => parseFloat(x) ** 2;
const fraction = (x) => parseFloat(x) / 100 / 100;
const sqrt = (x) =>
  Math.sqrt(parseFloat(x < 0 ? Math.abs(x) : x)) * (x < 1 ? -1 : 1);
const neg = (x) => x * -1;
const byHundred = (x) => {
  return parseFloat(x) / 100;
};

const op = {
  addition,
  subtraction,
  multiplication,
  division,
  percentage,
  exponent,
  fraction,
  sqrt,
  neg,
  byHundred,
};
export default op;
