import { truncate as xtruncate } from "truncate-ethereum-address";

export const truncate = (address?: string) => (address ? xtruncate(address) : "...");
