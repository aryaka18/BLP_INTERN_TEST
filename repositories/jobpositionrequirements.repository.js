const { JobPosition_Requirement } = require('../../models');

module.exports = {
  findOneByJobPositionId: (jobposition_id) => {
    return JobPosition_Requirement.findOne({
      where: {
        jobposition_id: jobposition_id,
      },
    });
  },
  create: (bodyData, transaction) => {
    return JobPosition_Requirement.create(bodyData, { transaction });
  },
  updateByJobPositionId: (jobposition_id, bodyToUpdate) => {
    return JobPosition_Requirement.update(bodyToUpdate, {
      where: {
        jobposition_id: jobposition_id,
      },
    });
  },
};
