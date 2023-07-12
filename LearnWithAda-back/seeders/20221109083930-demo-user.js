'use strict';
require('dotenv').config();
const crypto = require('crypto');

const salt = process.env.SALT;
const pass = crypto
    .pbkdf2Sync(process.env.ADMIN_PASS, salt, 1000, 64, `sha512`)
    .toString('hex');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('User', [{
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@gmail.com',
      password: pass,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('User', null, {});
  }
};
