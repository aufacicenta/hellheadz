import { screen, render } from "tests";

import { Marketplaces } from "./Marketplaces";

describe("Marketplaces", () => {
  it("renders children correctly", () => {
    render(<Marketplaces>Marketplaces</Marketplaces>);

    const element = screen.getByText("Marketplaces");

    expect(element).toBeInTheDocument();
  });
});
