import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Middleware para criptografar dados sensíveis
 * Implementa criptografia AES-256 conforme requisitos de segurança
 */
class EncryptionService {
  private algorithm: string = 'aes-256-cbc';
  private key: Buffer;
  private iv: Buffer;

  constructor() {
    // Em produção, a chave deve ser armazenada de forma segura
    // e não diretamente no código
    const secretKey = process.env.ENCRYPTION_KEY || 'AES256_encryption_key_for_cranial_app';
    this.key = crypto.scryptSync(secretKey, 'salt', 32);
    this.iv = crypto.randomBytes(16);
  }

  /**
   * Criptografa dados
   * @param data Dados a serem criptografados
   * @returns Dados criptografados
   */
  public encrypt(data: string): { encryptedData: string, iv: string } {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
      encryptedData: encrypted,
      iv: this.iv.toString('hex')
    };
  }

  /**
   * Descriptografa dados
   * @param encryptedData Dados criptografados
   * @param iv Vetor de inicialização
   * @returns Dados descriptografados
   */
  public decrypt(encryptedData: string, iv: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm, 
      this.key, 
      Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

export default EncryptionService;
