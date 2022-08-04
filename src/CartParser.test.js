import CartParser from "./CartParser";
import data from "../samples/cart.json";

//please put here path to your project folder
const basePath = "D:/baza/JS/work/BSA/BSA2021-Testing/";

const pathToValidCard = basePath + "samples/cart.csv";
const pathToCardWithInvalidRows = basePath + "samples/invalidRowCard.csv";
const pathToCardWithEmptyCell = basePath + "samples/emptyCellCard.csv";
const pathToCardWithNegativeNumber =
  basePath + "samples/negativeNumberCell.csv";
const pathToWrongHeaderNameCard = basePath + "samples/wrongHeaderNameCard.csv";

let parser;

beforeEach(() => {
  parser = new CartParser();
});

describe("CartParser - unit tests", () => {
  // Add your unit tests here.
  it("should return  calculated price in the cart 348.32", () => {
    expect(parser.calcTotal(data.items)).toBeCloseTo(348.32);
  });

  it("convert card line to a valid object ", () => {
    expect(parser.parseLine("Mollis consequat,9.00,2")).toEqual({
      id: expect.any(String),
      name: "Mollis consequat",
      price: 9,
      quantity: 2,
    });
  });

  it("parse CSV file to an valid object", () => {
    expect(parser.parse(pathToValidCard)).toEqual({
      items: [
        {
          id: expect.any(String),
          name: "Mollis consequat",
          price: 9,
          quantity: 2,
        },
        {
          id: expect.any(String),
          name: "Tvoluptatem",
          price: 10.32,
          quantity: 1,
        },
        {
          id: expect.any(String),
          name: "Scelerisque lacinia",
          price: 18.9,
          quantity: 1,
        },
        {
          id: expect.any(String),
          name: "Consectetur adipiscing",
          price: 28.72,
          quantity: 10,
        },
        {
          id: expect.any(String),
          name: "Condimentum aliquet",
          price: 13.9,
          quantity: 1,
        },
      ],
      total: 348.32,
    });
  });

  it("should return string", () => {
    expect(parser.readFile(pathToValidCard)).toEqual(expect.any(String));
  });

  it("should return empty array", () => {
    const content = parser.readFile(pathToValidCard);
    expect(parser.validate(content)).toEqual([]);
  });

  it("should return an array with Error about cells number", () => {
    const content = parser.readFile(pathToCardWithInvalidRows);
    expect(parser.validate(content)).toEqual([
      {
        column: expect.any(Number),
        message: expect.stringContaining(
          "Expected row to have 3 cells but received"
        ),
        row: expect.any(Number),
        type: "row",
      },
    ]);
  });

  it("should return an array with Error about wrong header name", () => {
    const content = parser.readFile(pathToWrongHeaderNameCard);
    expect(parser.validate(content)).toEqual([
      {
        column: expect.any(Number),
        message: expect.stringContaining("Expected header to be named"),
        row: expect.any(Number),
        type: "header",
      },
    ]);
  });

  it("should return an array with Error about empty cell", () => {
    const content = parser.readFile(pathToCardWithEmptyCell);
    expect(parser.validate(content)).toEqual([
      {
        column: expect.any(Number),
        message: expect.stringContaining(
          "Expected cell to be a nonempty string but received"
        ),
        row: expect.any(Number),
        type: "cell",
      },
    ]);
  });

  it("should return an array with Error about NaN or negative number cell", () => {
    const content = parser.readFile(pathToCardWithNegativeNumber);
    expect(parser.validate(content)).toEqual([
      {
        column: expect.any(Number),
        message: expect.stringContaining(
          "Expected cell to be a positive number but received"
        ),
        row: expect.any(Number),
        type: "cell",
      },
    ]);
  });

  it("should return an object with Error information", () => {
    expect(
      parser.createError(parser.ErrorType.ROW, 2, 3, "Some Error Message")
    ).toEqual({
      column: 3,
      message: "Some Error Message",
      row: 2,
      type: "row",
    });
  });
});

describe("CartParser - integration test", () => {
  // Add your integration test here.
  test("should throw Error 'Validation failed!", () => {
    expect(() => {
      parser.parse(pathToCardWithEmptyCell);
    }).toThrow("Validation failed!");
  });
});
