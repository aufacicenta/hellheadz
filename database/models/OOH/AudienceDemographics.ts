import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class AudienceDemographics extends Model<
  InferAttributes<AudienceDemographics>,
  InferCreationAttributes<AudienceDemographics>
> {
  // Unique identifier for each audience demographic entry.
  declare demographics_id: CreationOptional<string>;
  // Descriptive name or identifier for the demographic group.
  declare name: string;
  // JSON string to store an array or object of age ranges interested.
  declare age_ranges: string;
  // Gender the demographic targets, if applicable.
  declare gender: string;
  // JSON string to store an array of interests for the demographic.
  declare interests: string;

  static initModel(sequelize: Sequelize): typeof AudienceDemographics {
    AudienceDemographics.init(
      {
        demographics_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          comment: "Unique identifier for each audience demographic entry.",
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: "Descriptive name or identifier for the demographic group.",
        },
        age_ranges: {
          type: DataTypes.TEXT, // Storing as TEXT to accommodate JSON data.
          allowNull: true,
          comment: "JSON string to store an array or object of age ranges interested.",
          get() {
            const rawValue = this.getDataValue("age_ranges");
            return rawValue ? JSON.parse(rawValue) : null;
          },
          set(value: Array<string> | Object) {
            this.setDataValue("age_ranges", JSON.stringify(value));
          },
        },
        gender: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: "Gender the demographic targets, if applicable.",
        },
        interests: {
          type: DataTypes.TEXT, // Storing as TEXT to accommodate JSON data.
          allowNull: true,
          comment: "JSON string to store an array of interests for the demographic.",
          get() {
            const rawValue = this.getDataValue("interests");
            return rawValue ? JSON.parse(rawValue) : [];
          },
          set(value: Array<string>) {
            this.setDataValue("interests", JSON.stringify(value));
          },
        },
      },
      {
        sequelize,
        tableName: "audience_demographics",
        timestamps: true, // Enable automatic handling of createdAt and updatedAt
      },
    );

    return AudienceDemographics;
  }
}
