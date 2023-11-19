'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint("TransactionHistories", {
      fields: ["ProductId"],
      type: "foreign key",
      name: "product_fk",
      references: {
        table: "Products",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    await queryInterface.addConstraint("TransactionHistories", {
      fields: ["UserId"],
      type: "foreign key",
      name: "user_fk",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint("TransactionHistories", "product_fk");
    await queryInterface.removeConstraint("TransactionHistories", "user_fk");
  }
};
