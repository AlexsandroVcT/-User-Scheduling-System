import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter, } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';


class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date); //ira me mostrar a data atual , exemplo: 2022-11-07 as 08:00:00

    const appointments = await Appointment.finddAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    // prestador de serviços trabalhem nesse horario aqui
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
    ]

    const avaible = schedule.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyy-MM-dd'T'HH:mm:ssxxx"),
        available: //Verificando se o horario do agendamento passou das 19:00 Hrs
          isAfter(value, new Date()) && //verificando se o horario ja passou com data atual
          !appointments.find(a => format(a.date, 'HH:mm') == time),
      };
    });

    return res.json(avaible);
  }
}

export default new AvailableController();
