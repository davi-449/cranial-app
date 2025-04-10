import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para registrar todas as requisições e acessos
 * Implementa auditoria completa conforme requisitos de segurança
 */
class AuditService {
  /**
   * Registra uma ação no sistema
   * @param userId ID do usuário
   * @param action Ação realizada
   * @param resource Recurso acessado
   * @param details Detalhes adicionais
   */
  public static logAction(
    userId: number | string,
    action: string,
    resource: string,
    details?: any
  ): void {
    // Em uma implementação real, isso seria salvo em um banco de dados
    // ou enviado para um serviço de log externo
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      userId,
      action,
      resource,
      details,
    };
    
    console.log('AUDIT LOG:', JSON.stringify(logEntry));
  }

  /**
   * Middleware para registrar automaticamente todas as requisições
   */
  public static auditMiddleware(req: Request, res: Response, next: NextFunction): void {
    const userId = req.user ? req.user.id : 'anonymous';
    const action = req.method;
    const resource = req.originalUrl;
    
    AuditService.logAction(userId, action, resource);
    
    // Capturar o status da resposta
    const originalSend = res.send;
    res.send = function (body) {
      AuditService.logAction(userId, `${action}_RESPONSE`, resource, {
        statusCode: res.statusCode,
      });
      return originalSend.call(this, body);
    };
    
    next();
  }
}

export default AuditService;
