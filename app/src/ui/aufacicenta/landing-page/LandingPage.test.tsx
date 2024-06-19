import { screen, render } from "tests";

import { LandingPage } from "./LandingPage";

describe("LandingPage", () => {
  it("renders children correctly", () => {
    render(<LandingPage>LandingPage</LandingPage>);

    const element = screen.getByText("LandingPage");

    expect(element).toBeInTheDocument();
  });
});
