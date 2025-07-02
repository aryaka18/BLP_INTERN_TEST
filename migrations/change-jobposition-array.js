'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('JobPositions', 'requirements'),
      queryInterface.removeColumn('JobPositions', 'descriptions'),
      queryInterface.addColumn('JobPositions', 'requirements', {
        type: Sequelize.JSONB,
        defaultValue: [],
      }),
      queryInterface.addColumn('JobPositions', 'descriptions', {
        type: Sequelize.JSONB,
        defaultValue: [],
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn('JobPositions', 'requirements'),
      queryInterface.removeColumn('JobPositions', 'descriptions'),
      queryInterface.addColumn('JobPositions', 'requirements', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      }),
      queryInterface.addColumn('JobPositions', 'descriptions', {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      }),
    ]);
  },
};
