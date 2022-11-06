// SISTEMA ADICIONANDO AVATAR NO USUARIO
import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init( //Chamando o metodo init , da class Model
      {
        // Enviar as colunas atravez de um objetos, Podemos evitar as chaves primarias as chaves estrangeiras ....
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`; //abrindo a img do meu avatar no meu localhost
          }
        }
      },
      // Recebendo sequelize, como segundo parametro
      {
        sequelize,
      }
    );

    return this;
  }
}

export default File;
