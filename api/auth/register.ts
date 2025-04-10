import { Router } from 'express';
import AuthController from '../src/controllers/AuthController';

const router = Router();
const authController = new AuthController();

// Rota para registrar um novo usuário
router.post('/register', authController.register);

export default router;
