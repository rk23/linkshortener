'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'links',
      'count',
      Sequelize.INTEGER
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('links', 'count');  
  }
};
