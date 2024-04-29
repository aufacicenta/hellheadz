import { LarskristoHellheadsContextController } from "context/evm/larskristo-hellheads/LarskristoHellheadsContextController";

import { LatestCollectionProps } from "./LarsKristoHellheads.types";
import { LarsKristoHellheads } from "./LarsKristoHellheads";

export const LarsKristoHellheadsContainer: React.FC<LatestCollectionProps> = () => (
  <LarskristoHellheadsContextController>
    <LarsKristoHellheads />
  </LarskristoHellheadsContextController>
);
