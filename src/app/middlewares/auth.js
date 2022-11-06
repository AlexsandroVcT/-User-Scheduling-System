/**
 * middlewares, a melhor forma de interceptar minhas requisiçoes para fazer minhas validaçoes,
 * para impedir ou não que essa requisição continuie ser executada, é utilizando um middlewares
 */
import jwt from 'jsonwebtoken';
import { promisify } from 'util'; //metodo que pega uma function de callback

import authConfig from '../../config/auth';
// Esse middlewares ele precissa fazer uma verificação se o usuario estar logado

// Buscando Token
export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Desestruturando não quero utilizar o Bearer, utilizando a primeira posição do meu array
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret); //retorna uma função, e essa funtion é retornada

    req.userId = decoded.id;

    return next(); //se chegou ate aqui , o usuario pode acessar o controller porque ele esta autenticado
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
