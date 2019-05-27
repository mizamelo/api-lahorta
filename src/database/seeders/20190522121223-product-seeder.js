"use strict";

const faker = require("faker");
const { Product } = require("../../app/models");
const uuid = require("uuid/v4");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const items = generateFakeItems(20);
    // console.log(items[0]);
    return queryInterface.bulkInsert("products", items, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("products", null, {});
  }
};

function generateFakeItems(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    const newItem = {
      name: faker.commerce.productName(),
      description: `${faker.lorem.words()}`,
      price: faker.commerce.price(),
      discount: "0.0",
      created_at: faker.date.recent(90),
      updated_at: new Date()
    };
    items.push(newItem);
  }
  return items;
}
