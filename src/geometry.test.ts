import { RectangleAdapter, Square } from "./geometry";
import { Calculator, Rectangle } from "./geometry.third-party";

test("RectangleAdapter adapts Quadratic as a Rectangular object", () => {
  const square = new Square(3);
  const adapted = new RectangleAdapter(square);
  expect(Calculator.getArea(adapted)).toBeCloseTo(9);
  expect(Calculator.getPerimeter(adapted)).toBeCloseTo(12);
  expect(Calculator.getDiagonal(adapted)).toBeCloseTo(Math.sqrt(18));
});

test("Calculator.getWidthHeightRatio returns 1.0 for square via adapter", () => {
  const square = new Square(5);
  const adapted = new RectangleAdapter(square);
  expect(Calculator.getWidthHeightRatio(adapted)).toBeCloseTo(1.0);
});

test("Calculator.getWidthHeightRatio returns correct ratio for rectangle", () => {
  const rectangle = new Rectangle(10, 5);
  expect(Calculator.getWidthHeightRatio(rectangle)).toBeCloseTo(2.0);
});
