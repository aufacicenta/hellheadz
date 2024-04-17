// formats.ts
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Format extends Model<InferAttributes<Format>, InferCreationAttributes<Format>> {
  declare format_id: CreationOptional<string>;
  declare type: string;

  static initModel(sequelize: Sequelize): typeof Format {
    Format.init(
      {
        format_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "formats", // Explicit declaration of the table name in lowercase and underscored.
        timestamps: true, // Enabling Sequelize's automatic timestamps for createdAt and updatedAt.
      },
    );

    return Format;
  }
}
