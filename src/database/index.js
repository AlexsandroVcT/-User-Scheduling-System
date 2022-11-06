// Conecção com banco de dados

import Sequelize from "sequelize";
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment]; //Arrays de models
class Database {
  constructor() {
    this.init(); //chamando o propio metodo init
    this.mongo();
  }

  init() {
    // metodo init , que irar fazer a conecção com a base de dados e carregar nossos models
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection)) //Pecorrendo cada um dos model
      .map(model => model.associate && model.associate(this.connection.models));
  }
  mongo() {
    this.mongoConnection = new mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      { useNewUrlParser: true }
      //  useFindAndModify: true, =  useFindAndModify Esta desatualizado , então nao usamos mais
    );
  }

}
export default new Database();
