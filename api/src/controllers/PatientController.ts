import { Request, Response } from 'express';
import Patient from '../models/Patient';
import Measurement from '../models/Measurement';
import CranialCalculator from '../services/CranialCalculator';

class PatientController {
  // Criar um novo paciente
  public async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, birthDate, gender, notes } = req.body;

      if (!name || !birthDate) {
        return res.status(400).json({ message: 'Nome e data de nascimento são obrigatórios' });
      }

      const patient = await Patient.create({
        name,
        birthDate,
        gender,
        notes,
      });

      return res.status(201).json(patient);
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      return res.status(500).json({ message: 'Erro ao criar paciente' });
    }
  }

  // Listar todos os pacientes
  public async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const patients = await Patient.findAll({
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(patients);
    } catch (error) {
      console.error('Erro ao listar pacientes:', error);
      return res.status(500).json({ message: 'Erro ao listar pacientes' });
    }
  }

  // Buscar um paciente pelo ID
  public async findOne(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const patient = await Patient.findByPk(id, {
        include: [{ model: Measurement, as: 'measurements' }],
      });

      if (!patient) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }

      return res.status(200).json(patient);
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      return res.status(500).json({ message: 'Erro ao buscar paciente' });
    }
  }

  // Atualizar um paciente
  public async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { name, birthDate, gender, notes } = req.body;

      const patient = await Patient.findByPk(id);

      if (!patient) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }

      await patient.update({
        name,
        birthDate,
        gender,
        notes,
      });

      return res.status(200).json(patient);
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      return res.status(500).json({ message: 'Erro ao atualizar paciente' });
    }
  }

  // Remover um paciente
  public async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const patient = await Patient.findByPk(id);

      if (!patient) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }

      await patient.destroy();

      return res.status(200).json({ message: 'Paciente removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover paciente:', error);
      return res.status(500).json({ message: 'Erro ao remover paciente' });
    }
  }

  // Adicionar uma medição para um paciente
  public async addMeasurement(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { width, length, diagonalA, diagonalB, date } = req.body;

      // Verificar se o paciente existe
      const patient = await Patient.findByPk(id);
      if (!patient) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }

      // Validar medidas
      const validationError = Measurement.validateMeasurements(width, length, diagonalA, diagonalB);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      // Calcular índices
      const calculator = new CranialCalculator();
      const ci = calculator.calculateCI(width, length);
      const cvai = calculator.calculateCVAI(diagonalA, diagonalB);
      const classification = calculator.classifyDeformation(ci, cvai);

      // Criar medição
      const measurement = await Measurement.create({
        patientId: Number(id),
        width: Number(width),
        length: Number(length),
        diagonalA: Number(diagonalA),
        diagonalB: Number(diagonalB),
        ci,
        cvai,
        classification,
        date: date ? new Date(date) : new Date(),
      });

      return res.status(201).json(measurement);
    } catch (error) {
      console.error('Erro ao adicionar medição:', error);
      return res.status(500).json({ message: 'Erro ao adicionar medição' });
    }
  }

  // Gerar relatório para um paciente
  public async generateReport(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      // Verificar se o paciente existe
      const patient = await Patient.findByPk(id, {
        include: [
          {
            model: Measurement,
            as: 'measurements',
            order: [['date', 'ASC']],
          },
        ],
      });

      if (!patient) {
        return res.status(404).json({ message: 'Paciente não encontrado' });
      }

      // Verificar se o paciente tem medições
      const measurementsArray = patient.get('measurements');
      if (!measurementsArray || !Array.isArray(measurementsArray) || measurementsArray.length === 0) {
        return res.status(404).json({ message: 'Paciente não possui medições' });
      }

      // Gerar dados do relatório
      const measurements = measurementsArray as Measurement[];
      const latestMeasurement = measurements[measurements.length - 1];
      
      const reportData = {
        patient: {
          id: patient.id,
          name: patient.name,
          birthDate: patient.birthDate,
          gender: patient.gender,
        },
        measurements: measurements.map((m) => ({
          id: m.id,
          date: m.date,
          width: m.width,
          length: m.length,
          diagonalA: m.diagonalA,
          diagonalB: m.diagonalB,
          ci: m.ci.toFixed(2),
          cvai: m.cvai.toFixed(2),
          classification: m.classification,
        })),
        latestMeasurement: {
          date: latestMeasurement.date,
          ci: latestMeasurement.ci.toFixed(2),
          cvai: latestMeasurement.cvai.toFixed(2),
          classification: latestMeasurement.classification,
        },
        progressData: {
          dates: measurements.map((m) => m.date),
          ciValues: measurements.map((m) => m.ci),
          cvaiValues: measurements.map((m) => m.cvai),
        },
      };

      return res.status(200).json(reportData);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      return res.status(500).json({ message: 'Erro ao gerar relatório' });
    }
  }
}

export default PatientController;
