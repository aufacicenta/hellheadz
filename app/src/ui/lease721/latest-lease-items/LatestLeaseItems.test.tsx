import { screen, render } from "tests";

import { LatestLeaseItems } from "./LatestLeaseItems";

describe("LatestLeaseItems", () => {
  it("renders children correctly", () => {
    render(<LatestLeaseItems>LatestLeaseItems</LatestLeaseItems>);

    const element = screen.getByText("LatestLeaseItems");

    expect(element).toBeInTheDocument();
  });
});
