export enum FunctionToolCallName {
  // Database
  get_full_name = "get_full_name",
  // Assistants
  get_latest_listings = "get_latest_listings",
}

export type FunctionCallToolActionOutput = {
  success: boolean;
  functionCallName: FunctionToolCallName;
  data?: any;
};
