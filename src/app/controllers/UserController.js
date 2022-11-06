import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {

    // Validaçoes
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });
    //se bateu com a regra de cima, me return true
    if (!(await schema.isValid(req.body))) {
      // Se não me return false
      return res.status(400).json({ error: 'Falha na validação' });
    }

    // Verificar se ja existe aquele usuario com email que ta tendando cadastrar
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: "Usuário já existe." });
    }

    // Retorna para o front end, aqueles campo que são nescessarios do usuario
    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // EDIÇÃO CADASTRO DO USUARIO

  //Bloquear o usuario o tipo de rota caso ele não esteja logado, Edição do usuario
  // Metodo update vai servir para o usuario fazer alteração dos dados cadastrais dele
  async update(req, res) {

    // Validaçoes
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6), //oldPassword = informando a senha antiga
      password: Yup.string() //password = declarando uma nova senha
        .min(6)
        //when validação condiçonal
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    //se bateu com a regra de cima, me return true
    if (!(await schema.isValid(req.body))) {
      // Se não me return false
      return res.status(400).json({ error: 'Falha na validação' });
    }


    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);
    // Verificação caso o usuario esteja mudando de email

    if (email != user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe.' });
      }
    }
    // Verificando se o oldPassword bate com a senha antiga que ele tem

    if (oldPassword && !(await user.checkPassword(oldPassword))) { //dupla condição
      return res.status(401).json({ error: 'Senha não corresponde' });
    }

    await user.update(req.body);
    // Atualizando o usuario
    const { id, name, provider, avatar } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    // return res.json({ id, name, email, avatar });
  }
}

export default new UserController();
