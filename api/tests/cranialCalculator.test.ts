/**
 * Testes para o serviço de cálculo craniano
 */
import CranialCalculator from '../src/services/CranialCalculator';

describe('CranialCalculator', () => {
  let calculator: CranialCalculator;

  beforeEach(() => {
    calculator = new CranialCalculator();
  });

  describe('calculateCI', () => {
    it('should calculate CI correctly', () => {
      const result = calculator.calculateCI(100, 150);
      expect(result).toBeCloseTo(66.67, 2);
    });

    it('should throw error for invalid measurements', () => {
      expect(() => calculator.calculateCI(0, 150)).toThrow('Medidas inválidas');
      expect(() => calculator.calculateCI(100, 0)).toThrow('Medidas inválidas');
    });
  });

  describe('calculateCVAI', () => {
    it('should calculate CVAI correctly', () => {
      const result = calculator.calculateCVAI(180, 170);
      expect(result).toBeCloseTo(5.88, 2);
    });

    it('should throw error for invalid measurements', () => {
      expect(() => calculator.calculateCVAI(0, 170)).toThrow('Medidas inválidas');
      expect(() => calculator.calculateCVAI(180, 0)).toThrow('Medidas inválidas');
    });
  });

  describe('classifyDeformation', () => {
    it('should classify as Normal', () => {
      const result = calculator.classifyDeformation(80, 5);
      expect(result).toBe('Normal');
    });

    it('should classify as Plagiocefalia Grave', () => {
      const result = calculator.classifyDeformation(80, 8);
      expect(result).toBe('Plagiocefalia Grave');
    });

    it('should classify as Dolicocefalia', () => {
      const result = calculator.classifyDeformation(70, 5);
      expect(result).toBe('Dolicocefalia');
    });

    it('should classify as Braquicefalia', () => {
      const result = calculator.classifyDeformation(95, 5);
      expect(result).toBe('Braquicefalia');
    });
  });
});
