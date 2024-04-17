import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from "sequelize";

export class OOHMedia extends Model<InferAttributes<OOHMedia>, InferCreationAttributes<OOHMedia>> {
  declare media_id: CreationOptional<string>;
  declare format_id: string;
  declare location_id: string;
  declare size: string;
  declare digital: boolean;
  declare interactive_capabilities: boolean;
  declare visibility_score: number;
  declare availability_start_date: Date;
  declare availability_end_date: Date;
  declare price: number;
  declare rating: number;
  declare media_images: string;

  static initModel(sequelize: Sequelize): typeof OOHMedia {
    OOHMedia.init(
      {
        media_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          comment: "Unique identifier for each OOH media entry.",
        },
        format_id: {
          type: DataTypes.UUID,
          allowNull: false,
          comment: "Foreign key linking to the Formats table to specify the OOH format type.",
        },
        location_id: {
          type: DataTypes.UUID,
          allowNull: false,
          comment: "Foreign key linking to the Locations table for geographical data.",
        },
        size: {
          type: DataTypes.TEXT,
          allowNull: false,
          comment: "Describes physical dimensions or digital resolution (as JSON string).",
        },
        digital: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          comment: "Indicates whether the OOH media is digital.",
        },
        interactive_capabilities: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          comment: "Specifies if the digital media supports interactive features.",
        },
        visibility_score: {
          type: DataTypes.FLOAT,
          allowNull: true,
          comment: "A derived metric for estimating visibility or foot traffic.",
        },
        availability_start_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          comment: "Start date when the media is available for advertising.",
        },
        availability_end_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          comment: "End date until the media is available for advertising.",
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
          comment: "The cost of booking the media for advertising.",
        },
        rating: {
          type: DataTypes.FLOAT,
          allowNull: true,
          comment: "Optional rating based on past campaign performances or quality assessments.",
        },
        media_images: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: "JSON string containing URLs to images of the ad space.",
        },
      },
      {
        sequelize,
        tableName: "ooh_media",
        timestamps: true,
      },
    );

    return OOHMedia;
  }
}
