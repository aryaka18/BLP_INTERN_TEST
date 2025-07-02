module.exports = {
  create: async (req, res) => {
    const {
      title,
      joblevel_id,
      division_id,
      superior_id,
      purpose,
      requirements,
      descriptions,
    } = req.body;

    const position = await JobPosition.findOne({
      where: { title: title },
    });

    if (position !== null) {
      return res.sendBadRequest(
        'Job Title already exists. Consider editing the the job or use another name.'
      );
    }

    const newJobPosition = await JobPosition.create({
      title: title,
      joblevel_id: joblevel_id,
      division_id: division_id,
      superior_id: superior_id,
      purpose: purpose,
      requirements: requirements,
      descriptions: descriptions,
    });

    return res.sendDataCreated(
      'Success create a new Job Position and its Description',
      {
        id: newJobPosition.id,
        title: newJobPosition.title,
        descriptions: newJobPosition.descriptions,
        createdAt: newJobPosition.createdAt,
        updatedAt: newJobPosition.updatedAt,
      }
    );
  },
  findAll: async (req, res) => {
    try {
      const allJobdesc = await JobPosition.findAll({
        include: [
          { model: Division, attributes: ['id', 'name'], as: 'division' }, // this relation can be ignored
          { model: JobLevel, attributes: ['id', 'name'], as: 'job_level' }, // this relation can be ignored
          { model: User, attributes: ['id', 'full_name'], as: 'superior' }, // this relation can be ignored
          { model: JobPosition_Requirement, as: 'jobposition_req' },
        ],
        order: [['job_level', 'id', 'ASC']],
      });

      const response = allJobdesc?.map((position) => {
        return {
          id: position.id,
          title: position.title,
          joblevel_id: position.job_level?.id,
          joblevel_name: position.job_level?.name,
          division_id: position.division?.id,
          division_name: position.division?.name,
          superior_id: position.superior?.id,
          superior_name: position.superior?.full_name,
          purpose: position.purpose,
          requirements: position.requirements,
          descriptions: position.descriptions,
          careerForm: position.jobposition_req,
          createdAt: position.createdAt,
          updatedAt: position.updatedAt,
        };
      });

      res.sendJson(200, true, 'success find all data', response);
    } catch (error) {
      res.sendServerError(error.message);
    }
  },
  findByJobId: async (req, res) => {
    try {
      let passed_id = req.params.id;
      const position = await JobPosition.findOne({
        where: { id: passed_id },
        include: [
          { model: User, attributes: ['id', 'full_name'], as: 'superior' }, // this relation can be ignored
          { model: Division, attributes: ['id', 'name'], as: 'division' }, // this relation can be ignored
          { model: JobLevel, attributes: ['id', 'name'], as: 'job_level' }, // this relation can be ignored
          { model: JobPosition_Requirement, as: 'jobposition_req' },
        ],
      });

      const response = {
        id: position.id,
        title: position.title,
        joblevel_id: position.job_level?.id,
        joblevel_name: position.job_level?.name,
        division_id: position.division?.id,
        division_name: position.division?.name,
        superior_id: position.superior?.id,
        superior_name: position.superior?.full_name,
        purpose: position.purpose,
        requirements: position.requirements,
        descriptions: position.descriptions,
        careerForm: position.jobposition_req,
      };

      res.sendJson(200, true, 'success find data', response);
    } catch (error) {
      res.sendServerError(error.message);
    }
  },
  findByJobTitle: async (req, res) => {
    try {
      let parsed_title = req.body;
      const position = await JobPosition.findOne({
        where: { title: parsed_title },
      });
      const joblevel = await JobLevel.findOne({
        where: { id: position.joblevel_id },
        attributes: { include: ['id', 'name'] },
      });
      const division = await Division.findOne({
        where: { id: position.division_id },
        attributes: { include: ['id', 'name'] },
      });
      const superior = await User.findOne({
        where: { id: position.superior_id },
        attributes: { include: ['id', 'name'] },
      });

      const response = {
        id: position.id,
        title: position.title,
        joblevel_id: joblevel?.id,
        joblevel_name: joblevel?.name,
        division_id: division?.id,
        division_name: division?.name,
        superior_id: superior?.id,
        superior_name: superior?.name,
        purpose: position.purpose,
        requirements: position.requirements,
        descriptions: position.descriptions,
      };

      res.sendJson(200, true, 'success find data', response);
    } catch (error) {
      res.sendServerError(error.message);
    }
  },
  updateById: async (req, res) => {
    try {
      const {
        title,
        joblevel_id,
        division_id,
        superior_id,
        purpose,
        requirements,
        descriptions,
        careerForm,
      } = req.body;

      const position_id = req.params.id;
      const updatedJobdesc = await JobPosition.update(
        {
          title: title,
          joblevel_id: joblevel_id,
          division_id: division_id,
          superior_id: superior_id,
          purpose: purpose,
          requirements: requirements,
          descriptions: descriptions,
        },
        {
          where: { id: position_id },
        }
      );
      if (updatedJobdesc.length === 0) {
        res.sendNoContent('Error update Jobdesc');
      }

      const jobposreq =
        await jobpositionrequirementsRepository.findOneByJobPositionId(
          position_id
        );

      if (!jobposreq) {
        const transaction = await sequelize.transaction(async (tr) => {
          careerForm.jobposition_id = position_id;
          const newJobPosReq = await jobpositionrequirementsRepository.create(
            careerForm,
            tr
          );

          return newJobPosReq;
        });
      } else {
        const updateJobPosReq =
          await jobpositionrequirementsRepository.updateByJobPositionId(
            position_id,
            careerForm
          );
      }

      res.sendJson(200, true, 'Success update Jobdesc', updatedJobdesc);
    } catch (error) {
      res.sendServerError(error.message);
    }
  },
  delete: async (req, res) => {
    try {
      const job_position_id = req.body.id;
      const deleted = await JobPosition.destroy({
        where: { id: job_position_id },
      });

      if (!deleted) {
        return res.sendNoContent('id job position not found');
      }
      res.sendJson(200, true, 'success delete job position', deleted);
    } catch (error) {
      res.sendServerError(error.message);
    }
  },
};
