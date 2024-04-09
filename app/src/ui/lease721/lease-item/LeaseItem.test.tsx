import { screen, render } from "tests";

import { LeaseItem } from "./LeaseItem";

describe("LeaseItem", () => {
  it("renders children correctly", () => {
    render(<LeaseItem>LeaseItem</LeaseItem>);

    const element = screen.getByText("LeaseItem");

    expect(element).toBeInTheDocument();
  });
});
