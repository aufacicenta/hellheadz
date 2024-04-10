import { screen, render } from "tests";

import { InitialMessageOptions } from "./InitialMessageOptions";

describe("InitialMessageOptions", () => {
  it("renders children correctly", () => {
    render(<InitialMessageOptions>InitialMessageOptions</InitialMessageOptions>);

    const element = screen.getByText("InitialMessageOptions");

    expect(element).toBeInTheDocument();
  });
});
