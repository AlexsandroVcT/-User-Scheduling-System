
import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    // Check principal
    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Apenas o provedor pode carregar notificações' })

    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true } //Depois que ele atualizar , ele vai retorna a nova notificação atualizada
    );

    return res.json(notification);
  }
}

export default new NotificationController();
