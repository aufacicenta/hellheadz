import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class Location extends Model<InferAttributes<Location>, InferCreationAttributes<Location>> {
  declare location_id: CreationOptional<string>;
  declare city: string;
  declare state: string;
  declare country: string;
  declare latitude: CreationOptional<number>;
  declare longitude: CreationOptional<number>;
  declare landmark_proximity: CreationOptional<string>;

  static initModel(sequelize: Sequelize): typeof Location {
    Location.init(
      {
        location_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        state: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        latitude: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        longitude: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        landmark_proximity: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "locations",
        timestamps: true, // Assuming `createdAt` and `updatedAt` are managed automatically.
      },
    );

    return Location;
  }
}
