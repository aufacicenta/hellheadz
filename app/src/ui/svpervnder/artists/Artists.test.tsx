import { screen, render } from "tests";

import { Artists } from "./Artists";

describe("Artists", () => {
  it("renders children correctly", () => {
    render(<Artists>Artists</Artists>);

    const element = screen.getByText("Artists");

    expect(element).toBeInTheDocument();
  });
});
