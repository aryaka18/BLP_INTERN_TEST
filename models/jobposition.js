'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobPosition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Division, {
        foreignKey: 'division_id',
        as: 'division',
      });
      this.belongsTo(models.JobLevel, {
        foreignKey: 'joblevel_id',
        as: 'job_level',
      });
      this.belongsTo(models.User, {
        foreignKey: 'superior_id',
        as: 'superior',
      });
      this.hasMany(models.User, {
        foreignKey: 'jobposition_id',
        as: 'jobposition',
      });
      this.hasMany(models.NumberCode, {
        foreignKey: 'jobposition_id',
        as: 'numbercode',
      });
      this.hasMany(models.NumberRequest, {
        foreignKey: 'signer_id',
        as: 'assigned_number_request',
      });
      this.hasMany(models.JobPosition_Requirement, {
        foreignKey: 'jobposition_id',
        as: 'jobposition_req',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.GroupMatrix_Member, {
        foreignKey: 'job_position_id',
        as: 'competency',
      });
    }
  }
  JobPosition.init(
    {
      title: {
        type: DataTypes.STRING,
        unique: true,
      },
      joblevel_id: DataTypes.INTEGER,
      division_id: DataTypes.INTEGER,
      superior_id: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      purpose: DataTypes.STRING,
      requirements: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      descriptions: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: 'JobPosition',
    }
  );
  return JobPosition;
};
