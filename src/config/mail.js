// Sistema de envio de Email
/**
 * Enviar um Email para esse prestador de serviço , Toda vez que um cancelamento de agendamento ocorrer
 */

export default {
  host: "smtp.mailtrap.io", //Enviar o Email atraves de SMTP
  port: 2525,
  secure: false, //se ele esta ùtilizando SSL Ou não , se é seguro ou n
  auth: {
    user: "535b797e2b26e4",
    pass: "7613e8cf41a71e",
  },
  default: {
    from: 'Equipe perforgram <alexsandro@perforgram.com',
  },
};

/** Metodos de serviços de Email,
 * Amazon SES, Mailgun, Sparkpost, Mandril (Mailchimp),
 * Utilizando Mailtrap (DEV) que funciona para ambiente de desenvolvimento, ele nao vai funcionar para quando aplicação estiver Online
 */
