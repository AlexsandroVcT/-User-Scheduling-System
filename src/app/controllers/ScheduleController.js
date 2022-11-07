// LISTAGEM UNICA PRO PRESTADOR DE SERVIÇOS
import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Op } from "sequelize";

import User from "../models/User";
import Appointment from "../models/Appointment";

// CONTROLADOR DE AGENDAMENTO
class ScheduleController {
  async index(req, res) {
    // verificação se o usuario que esta logado é prestador de serviços
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    })
    if (!checkUserProvider) {
      return res.status(401).json({ error: 'O usuário não é um provedor' });
    }


    const { date } = req.query; // Verificando as datas do agendamentos
    //2022-11-05 00:00:00 = enviando a data para o Backend, Pegando os a primeira hora do dia 00:00, & a ultima hora do dia, e vou ver o agendamento entre aqueles valores
    // 2019-08-22 23:59:59 termina
    const parsedDate = parseISO(date);

    // Utilizando os dias do usuário, não o horario
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId, //Verificar todos os agendamentos que o prestador for do usuario logado
        canceled_at: null, //que não estão cancelados
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)], //que a data esta entre o começo eo final do dia que recebemos como parametros
        },
      },
      order: ['date'],
    });
    return res.json(appointments);
  }
}
export default new ScheduleController();
