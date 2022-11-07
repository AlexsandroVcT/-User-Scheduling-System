// ROTA DE AGENDAMENTO DE SERVIÇO , PARA UM USUARIO PODER AGENDAR UM SERVIÇO COM ALGUM PRESTADOR DE SERVIÇO, SE O PROVIDER FOR TRUE
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from "../models/Appointment";
import Notification from '../schemas/Notification';

import Mail from '../../lib/Mail';

class AppointmentController {
  // Listando agendamentos do usuário
  async index(req, res) {
    const { page = 1 } = req.query; //Aplicando paginação

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'], //order em array, posso ter varias ordernaçoes
      attributes: ['id', 'date'],
      limit: 20, //limite da  paginação
      offset: (page - 1) * 20, //pulando nenhum registro,  paginação
      include: [ //dados do prestador de serviços
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(appointments)
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { provider_id, date } = req.body;

    /**
     * Verifique se provider_id é um provedor
     */

    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });


    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Você só pode criar compromissos com provedores' })
    }

    /**
     * Verifique as datas anteriores
     */
    console.log(date, parseISO(date))
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Datas anteriores não são permitidas' });
    }

    /**
     * Verifique a disponibilidade de datas
     */
    console.log(hourStart)
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });


    if (checkAvailability) {
      return res.status(400).json({ error: 'A data de agendamento não está disponível' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date, //retirei o, :hourStart
    });

    /**
     * Notificar prestador de serviços
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', ás' HH:mm'h'",
      { locale: pt }
    )
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,

    });

    return res.json(appointment);
  }

  // METODO DE CANCELAMENTO
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        }
      ],
    });

    console.log(req.userId)
    if (appointment.user_id != req.userId) {
      return res.status(401).json({
        error: "Você não tem permissão para cancelar este compromisso"
      });
    }
    console.log(dateWithSub)
    // Verificação de date , ele tem que cancela 2 horas antes
    const dateWithSub = subHours(appointment.date, 2); //removendo 2 horas do horario do agendamento
    // Exemplo: 13:00 - 2 Horas = dateWithSub 11Hrs
    // now: 11:25H , ja passou não consigo agendar
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: "Yon só pode cancelar compromissos com 2 horas de antecedência.",
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    // Enviando algumas informaçoes para o prestador de serviços
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`, //Formato para escrever o remetente e o destinatário do email
      subject: 'Agendemanto cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          appointment.date,
          "'dia' dd 'de' MMMM', ás' H:mm'h'",
          { locale: pt }
        )
      }
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
