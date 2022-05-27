import { createIndex } from ".";

describe("createIndex", () => {
  it("should index a collection by a common property", () => {
    const [john, jane, joe] = [
      { name: "John", age: "30" },
      { name: "Jane", age: "30" },
      { name: "Joe", age: "40" },
    ];

    const index = createIndex([john, jane, joe], ["age"] as const);

    expect(index).toEqual({
      "30": [john, jane],
      "40": [joe],
    });
  });

  it("should index a collection by multiple common properties", () => {
    const collection = [
      { name: "John", age: "30", city: "New York" },
      { name: "Jane", age: "30", city: "New York" },
      { name: "Joe", age: "40", city: "New York" },
      { name: "Jaden", age: "30", city: "Paris" },
      { name: "Jasmine", age: "30", city: "Paris" },
      { name: "Jas", age: "40", city: "Paris" },
    ] as const;
    const [john, jane, joe, jaden, jasmine, jas] = collection;

    const index = createIndex(collection, ["city", "age"] as const);

    expect(index).toEqual({
      "New York": {
        "30": [john, jane],
        "40": [joe],
      },
      Paris: {
        "30": [jaden, jasmine],
        "40": [jas],
      },
    });
  });
});
