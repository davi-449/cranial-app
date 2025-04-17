/**
 * Utilitário de segurança para sanitização de inputs
 * Previne ataques de injeção SQL e XSS
 */

/**
 * Sanitiza uma string de entrada removendo caracteres potencialmente perigosos
 * @param input - O valor a ser sanitizado
 * @returns O valor sanitizado
 */
export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    // Remove caracteres que podem ser usados em ataques XSS ou injeção SQL
    const forbiddenChars = /[;&<>'"]/g;
    return input.replace(forbiddenChars, '');
  }
  
  // Se não for string, retorna o valor original
  return input;
};

/**
 * Sanitiza um objeto inteiro, aplicando sanitizeInput a todas as propriedades string
 * @param obj - O objeto a ser sanitizado
 * @returns O objeto com valores sanitizados
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = { ...obj };
  
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  });
  
  return sanitized;
};

/**
 * Sanitiza parâmetros de URL para evitar ataques de injeção
 * @param params - Objeto com parâmetros de URL
 * @returns String de parâmetros sanitizada
 */
export const sanitizeUrlParams = (params: Record<string, any>): string => {
  const sanitizedParams = sanitizeObject(params);
  
  return Object.keys(sanitizedParams)
    .map(key => {
      const value = sanitizedParams[key];
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
};
