import { describe, expect, it } from "vitest";

import { removeFirstByProp } from "./arrayHelpers";

describe("removeFirstByProp", () => {
  it("removes only the first matching item", () => {
    const items = [
      { id: 1, name: "first" },
      { id: 2, name: "second" },
      { id: 1, name: "third" },
    ];

    expect(removeFirstByProp(items, "id", 1)).toEqual([
      { id: 2, name: "second" },
      { id: 1, name: "third" },
    ]);
    expect(items).toHaveLength(3);
  });

  it("returns an equivalent new array when no item matches", () => {
    const items = [{ id: 1 }, { id: 2 }];
    const result = removeFirstByProp(items, "id", 3);

    expect(result).toEqual(items);
    expect(result).not.toBe(items);
  });

  it("uses strict equality for the selected property", () => {
    const items = [{ value: 1 }, { value: "1" }];

    expect(removeFirstByProp(items, "value", "1")).toEqual([{ value: 1 }]);
  });
});
