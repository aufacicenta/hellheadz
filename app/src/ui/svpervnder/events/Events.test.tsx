import { screen, render } from "tests";

import { Events } from "./Events";

describe("Events", () => {
  it("renders children correctly", () => {
    render(<Events>Events</Events>);

    const element = screen.getByText("Events");

    expect(element).toBeInTheDocument();
  });
});
