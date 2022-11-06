// Migration e model de agendamento
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: { //date do agendamento
        allowNull: false,
        type: Sequelize.DATE,
      },
      user_id: { //Assim que o usuario for deletado, todos os agendamentos dos usuarios tbm serão deletados!
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', //se o usuario deleta a conta dele do app, o prestador de serviço irar manter o historico dos agendamentos mesmo se o usuario não existindo mais
        allowNull: true,
      },
      provider_id: { //prestador de serviços que irar atender
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      canceled_at: { //se o usuario cancelar o agendamento , não irar deleta-lo no banco de dados, irei marca a data que ele foi cancelado
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

  },

  down: queryInterface => {
    return queryInterface.dropTable('appointments');
  }
};
