import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),

    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (process.env.NODE_ENV === 'development') {
      if (!user || !(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Email or password are incorrect' });
      }
    }

    else {

    }

    // Verificando se usuario não existe
    // if (!user) {
    //   return res.status(401).json({ error: 'Usuário não encontrado' });
    // }

    // Verificação se a senha não ta batendo
    // if (!(await user.checkPassword(password))) {
    //   return res.status(401).json({ error: 'Senha não corresponde' });
    // }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
        provider,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
