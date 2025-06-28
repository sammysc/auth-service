"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Students", "password", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "changeme", // valor padrão temporário
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Students", "password");
  },
};
