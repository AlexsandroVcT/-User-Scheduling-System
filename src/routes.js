import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import ProviderController from './app/controllers/ProviderController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';


import authMiddleware from './app/middlewares/auth';
import AvailableController from './app/controllers/AvailableController';

// ROTAS DO MEU GOBARBER NO Insomnia
const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); //esse routes só irar valer para rotas que vinherem APÓS

routes.put('/users', UserController.update); //evitar que essa rota seja acessada quando o usuario não tiver logado

routes.get('/providers', ProviderController.index);
// routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/appointments', AppointmentController.index); //listando agendamento do usuário
routes.post('/appointments', AppointmentController.store); //agendamento
routes.delete('/appointments/:id', AppointmentController.delete); //cancelamento do agendamento

routes.get('/schedule', ScheduleController.index); //Banco não relacional - MongoDB

routes.post('/files', upload.single('file'), FileController.store); //post avatar

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update); //marca uma notificação como Lida


export default routes;
