import { screen, render } from "tests";

import { LarsKristoHellheads } from "./LarsKristoHellheads";

describe("LatestCollection", () => {
  it("renders children correctly", () => {
    render(<LarsKristoHellheads>LatestCollection</LarsKristoHellheads>);

    const element = screen.getByText("LatestCollection");

    expect(element).toBeInTheDocument();
  });
});
