import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

class AuthController {
  // Registrar um novo usuário
  public async register(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }

      // Verificar se o usuário já existe
      const existingUser = await User.findOne({
        where: {
          username,
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Nome de usuário já existe' });
      }

      // Verificar se o email já existe
      const existingEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (existingEmail) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }

      // Criar o usuário
      const user = await User.create({
        username,
        password, // Em uma implementação real, a senha seria criptografada
        email,
        role: 'user',
      });

      // Remover a senha do objeto de resposta
      const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      return res.status(201).json(userResponse);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
  }

  // Login de usuário
  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios' });
      }

      // Buscar o usuário
      const user = await User.findOne({
        where: {
          username,
        },
      });

      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Verificar a senha (em uma implementação real, usaria bcrypt.compare)
      if (user.password !== password) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET || 'cranial_app_secret_key',
        {
          expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '7', 10) * 24 * 60 * 60, // Converts days to seconds
        },
      );

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ message: 'Erro ao fazer login' });
    }
  }
}

export default AuthController;
