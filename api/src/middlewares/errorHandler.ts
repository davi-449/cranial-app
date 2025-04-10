import { Request, Response, NextFunction } from 'express';

// Middleware para tratamento global de erros
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): Response => {
  console.error('Erro não tratado:', err);
  
  // Verificar se é um erro conhecido
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: (err as any).errors.map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }
  
  // Erro de autenticação
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Erro de autenticação',
      error: err.message,
    });
  }
  
  // Erro genérico
  return res.status(500).json({
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
};

export default errorHandler;
