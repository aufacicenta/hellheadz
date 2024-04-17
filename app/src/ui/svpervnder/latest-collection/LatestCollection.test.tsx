import { screen, render } from "tests";

import { LatestCollection } from "./LatestCollection";

describe("LatestCollection", () => {
  it("renders children correctly", () => {
    render(<LatestCollection>LatestCollection</LatestCollection>);

    const element = screen.getByText("LatestCollection");

    expect(element).toBeInTheDocument();
  });
});
