'use strict';
const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert("Users", [
      {
        full_name: "admin",
        email: "admin@mail.com",
        password: hashPassword("rahasia"),
        gender: "male",
        role: "admin",
        balance: 1000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", [
      {
        email: "admin@mail.com",
      }
    ], {});
  }
};
