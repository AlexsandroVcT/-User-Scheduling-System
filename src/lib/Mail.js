// import nodemailer from 'nodemailer';
import { resolve } from 'path';
// import exphbs from 'express-handlebars'; // Metodo desatualizado
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

// const nodemailerhbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars'); // tive que criar exphbs como const para poder crear o usuario

class Mail {
  constructor() {
    const { host, port, secure, auth, } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
    this.transporter.use(
      'compile', //Como ele formata nossa mensagem do Email
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      }),
    );
  }
  // Responsavel de enviar o Email
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
