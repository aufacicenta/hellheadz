// advertisers.ts
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Advertiser extends Model<InferAttributes<Advertiser>, InferCreationAttributes<Advertiser>> {
  declare advertiser_id: CreationOptional<string>;
  declare name: string;
  declare industry: string;
  declare preferred_demographics: CreationOptional<string>;

  static initModel(sequelize: Sequelize): typeof Advertiser {
    Advertiser.init(
      {
        advertiser_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        industry: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        preferred_demographics: {
          type: DataTypes.TEXT, // Assuming this could be a JSON string or large text field.
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "advertisers", // Explicit declaration of the table name in lowercase and underscored.
        timestamps: true, // Enabling Sequelize's automatic timestamps for createdAt and updatedAt.
      },
    );

    return Advertiser;
  }
}
