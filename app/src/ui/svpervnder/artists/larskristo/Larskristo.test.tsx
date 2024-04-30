import { screen, render } from "tests";

import { Larskristo } from "./Larskristo";

describe("Larskristo", () => {
  it("renders children correctly", () => {
    render(<Larskristo>Larskristo</Larskristo>);

    const element = screen.getByText("Larskristo");

    expect(element).toBeInTheDocument();
  });
});
