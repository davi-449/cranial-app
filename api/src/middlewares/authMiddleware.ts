import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: number;
  username: string;
  role: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void | Response => {
  try {
    // Obter o token do cabeçalho Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar o token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'cranial_app_secret_key'
    ) as DecodedToken;
    
    // Adicionar informações do usuário ao objeto de requisição
    req.user = { id: 1, username: 'usuario_teste', role: 'user' }; // Dados fictícios
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

export default authMiddleware;
