import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init( //Chamando o metodo init , da class Model
      {
        // Enviar as colunas atravez de um objetos, Podemos evitar as chaves primarias as chaves estrangeiras ....
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        // created_at: Sequelize.DATE,
        // updated_at: Sequelize.DATE,

      },
      // Recebendo sequelize, como segundo parametro
      {
        sequelize,
      }
    );

    // addHook Executando de forma automatica, executando antes de qualquer save
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // relacionando o metodo do avatar no users
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
