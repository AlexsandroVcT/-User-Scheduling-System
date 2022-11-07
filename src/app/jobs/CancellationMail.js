import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  // Enviando algumas informaçoes para o prestador de serviços no caso um Email
  async handle({ data }) {
    const { appointment } = data;

    console.log('A fila executou! ');

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`, //Formato para escrever o remetente e o destinatário do email
      subject: 'Agendemanto cancelado',
      template: 'cancellation',
      context: { //Enviando todas as variaveis que esse meu cancellation esta esperando
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date),
          "'dia' dd 'de' MMMM', ás' H:mm'h'", {
          locale: pt,
        }),
      },
    });

  }
}

export default new CancellationMail();
// import CancellationMail from '..'
