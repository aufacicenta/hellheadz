import { screen, render } from "tests";

import { DetailsModal } from "./DetailsModal";

describe("DetailsModal", () => {
  it("renders children correctly", () => {
    render(<DetailsModal>DetailsModal</DetailsModal>);

    const element = screen.getByText("DetailsModal");

    expect(element).toBeInTheDocument();
  });
});
