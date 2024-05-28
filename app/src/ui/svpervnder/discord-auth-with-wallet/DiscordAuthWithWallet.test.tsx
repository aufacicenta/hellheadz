import { screen, render } from "tests";

import { DiscordAuthWithWallet } from "./DiscordAuthWithWallet";

describe("DiscordAuthWithWallet", () => {
  it("renders children correctly", () => {
    render(<DiscordAuthWithWallet>DiscordAuthWithWallet</DiscordAuthWithWallet>);

    const element = screen.getByText("DiscordAuthWithWallet");

    expect(element).toBeInTheDocument();
  });
});
