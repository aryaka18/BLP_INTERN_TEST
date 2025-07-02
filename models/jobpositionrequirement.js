'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobPosition_Requirement extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.JobPosition, {
        foreignKey: 'jobposition_id',
        as: 'jobposition',
      });
    }
  }
  JobPosition_Requirement.init(
    {
      jobposition_id: { type: DataTypes.INTEGER, allowNull: false },
      education: DataTypes.STRING,
      length_service: DataTypes.INTEGER,
      performance: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'JobPosition_Requirement',
    }
  );
  return JobPosition_Requirement;
};
