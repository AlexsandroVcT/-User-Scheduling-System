// Configuração da parte de upload de arquivos
import multer from "multer";
import crypto from 'crypto';
import { extname, resolve } from 'path'; //extname = retorna baseado no nome d euma img ou no nome de um arquivo qual que é a extenção da quele arquivo, resolve = percorrer um caminho dentro da minha aplicação

/* req = requisição do express
 * file = todos os dados do arquivos do usuario que esta fazendo uploads, exemplo , tamanho do arquivo, tipo do arquivo se é uma img ou se não é , o formato do arquivo, nome do arquivo.....
 */

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), //desatinos do nosso arquivos
    filename: (req, file, cb) => { //recebendo os 3 parametros requeri, file, callback
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        return cb(null, res.toString('hex') + extname(file.originalname)) //transformando 16bits de conteudo aleatorio em uma string hex decimal
      });
    },
  }),
};
