import { screen, render } from "tests";

import { GridItem } from "./GridItem";

describe("GridItem", () => {
  it("renders children correctly", () => {
    render(<GridItem>GridItem</GridItem>);

    const element = screen.getByText("GridItem");

    expect(element).toBeInTheDocument();
  });
});
