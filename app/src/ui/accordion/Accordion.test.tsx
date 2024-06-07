import { screen, render } from "tests";

import { Accordion } from "./Accordion";

describe("Accordion", () => {
  it("renders children correctly", () => {
    render(<Accordion>Accordion</Accordion>);

    const element = screen.getByText("Accordion");

    expect(element).toBeInTheDocument();
  });
});
