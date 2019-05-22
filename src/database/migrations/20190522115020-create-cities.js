const uuid = require("uuid/v4");

("use strict");
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("clients", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        }
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "states",
          key: "id"
        }
      },
      zip_code: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      complement: {
        type: Sequelize.STRING,
        allowNull: true
      },
      photo: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.INTEGER
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("clients");
  }
};
