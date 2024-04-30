import type { Sequelize } from "sequelize";
import { ContentExtraction } from "./ContentExtraction";
import { SquareOrder } from "./SquareOrder";
import { UserInfo } from "./UserInfo";
import { UserAddress } from "./UserAddress";
import { UserCompany } from "./UserCompany";
import { UserCompany_GT } from "./UserCompany_GT";
import { UserSession } from "./UserSession";
import { User } from "./User";
import { Location } from "./OOH/Location";
import { OOHMedia } from "./OOH/Media";
import { Format } from "./OOH/Format";
import { AudienceDemographics } from "./OOH/AudienceDemographics";

export {
  ContentExtraction,
  SquareOrder,
  UserInfo,
  UserAddress,
  UserCompany,
  UserCompany_GT,
  UserSession,
  Location,
  Format,
  OOHMedia,
  AudienceDemographics,
};

export function initModels(sequelize: Sequelize) {
  ContentExtraction.initModel(sequelize);
  SquareOrder.initModel(sequelize);
  UserInfo.initModel(sequelize);
  UserAddress.initModel(sequelize);
  UserCompany.initModel(sequelize);
  UserCompany_GT.initModel(sequelize);
  UserSession.initModel(sequelize);

  Location.initModel(sequelize);
  Format.initModel(sequelize);
  OOHMedia.initModel(sequelize);
  AudienceDemographics.initModel(sequelize);

  OOHMedia.belongsTo(Format, { foreignKey: "format_id", as: "format" });
  OOHMedia.belongsTo(Location, { foreignKey: "location_id", as: "location" });

  return {
    ContentExtraction,
    SquareOrder,
    UserInfo,
    UserAddress,
    UserCompany,
    UserCompany_GT,
    UserSession,

    Location,
  };
}
