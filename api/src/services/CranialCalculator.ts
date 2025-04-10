/**
 * Serviço para cálculos cranianos
 * Implementa as fórmulas:
 * - Índice Craniano (CI) = (Largura/Comprimento) * 100
 * - CVAi = (|DiagonalA - DiagonalB| / MenorDiagonal) * 100
 */
class CranialCalculator {
  /**
   * Calcula o Índice Craniano (CI)
   * @param width Largura do crânio em mm
   * @param length Comprimento do crânio em mm
   * @returns Índice Craniano (CI)
   */
  public calculateCI(width: number, length: number): number {
    if (width <= 0 || length <= 0) {
      throw new Error('Medidas inválidas');
    }
    return (width / length) * 100;
  }

  /**
   * Calcula o Índice de Assimetria da Volta Craniana (CVAI)
   * @param diagonalA Diagonal A em mm
   * @param diagonalB Diagonal B em mm
   * @returns Índice CVAI
   */
  public calculateCVAI(diagonalA: number, diagonalB: number): number {
    if (diagonalA <= 0 || diagonalB <= 0) {
      throw new Error('Medidas inválidas');
    }
    
    const minDiagonal = Math.min(diagonalA, diagonalB);
    return (Math.abs(diagonalA - diagonalB) / minDiagonal) * 100;
  }

  /**
   * Classifica a deformação craniana conforme critérios de Argenta
   * @param ci Índice Craniano
   * @param cvai Índice de Assimetria da Volta Craniana
   * @returns Classificação da deformação
   */
  public classifyDeformation(ci: number, cvai: number): string {
    if (cvai >= 7) {
      return 'Plagiocefalia Grave';
    }
    
    if (ci < 76) {
      return 'Dolicocefalia';
    }
    
    if (ci > 90) {
      return 'Braquicefalia';
    }
    
    return 'Normal';
  }
}

export default CranialCalculator;
