// Sistema de envio de Email
/**
 * Enviar um Email para esse prestador de serviço , Toda vez que um cancelamento de agendamento ocorrer
 */

export default {
  host: process.env.MAIL_HOST, //Enviar o Email atraves de SMTP
  port: process.env.MAIL_PORT,
  secure: false, //se ele esta ùtilizando SSL Ou não , se é seguro ou n
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe perforgram <alexsandro@perforgram.com',
  },
};

/** Metodos de serviços de Email,
 * Amazon SES, Mailgun, Sparkpost, Mandril (Mailchimp),
 * Utilizando Mailtrap (DEV) que funciona para ambiente de desenvolvimento, ele nao vai funcionar para quando aplicação estiver Online
 */
