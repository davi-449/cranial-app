/**
 * Testes para o controlador de pacientes
 */
import request from 'supertest';
import app from '../src/index';
import Patient from '../src/models/Patient';
import Measurement from '../src/models/Measurement';

// Mock do modelo Patient
jest.mock('../src/models/Patient');
jest.mock('../src/models/Measurement');

describe('PatientController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/patients', () => {
    it('should return all patients', async () => {
      const mockPatients = [
        { id: 1, name: 'Paciente 1', birthDate: '2020-01-01' },
        { id: 2, name: 'Paciente 2', birthDate: '2019-05-10' }
      ];
      
      (Patient.findAll as jest.Mock).mockResolvedValue(mockPatients);
      
      const response = await request(app)
        .get('/api/patients')
        .expect(200);
      
      expect(response.body).toEqual(mockPatients);
      expect(Patient.findAll).toHaveBeenCalledWith({
        order: [['createdAt', 'DESC']]
      });
    });

    it('should handle errors', async () => {
      (Patient.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        .get('/api/patients')
        .expect(500);
      
      expect(response.body).toHaveProperty('message', 'Erro ao listar pacientes');
    });
  });

  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      const newPatient = {
        name: 'Novo Paciente',
        birthDate: '2021-03-15',
        gender: 'male'
      };
      
      const createdPatient = { id: 1, ...newPatient };
      (Patient.create as jest.Mock).mockResolvedValue(createdPatient);
      
      const response = await request(app)
        .post('/api/patients')
        .send(newPatient)
        .expect(201);
      
      expect(response.body).toEqual(createdPatient);
      expect(Patient.create).toHaveBeenCalledWith(newPatient);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({ gender: 'male' })
        .expect(400);
      
      expect(response.body).toHaveProperty('message');
      expect(Patient.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/patients/:id', () => {
    it('should return a patient by id', async () => {
      const mockPatient = {
        id: 1,
        name: 'Paciente 1',
        birthDate: '2020-01-01',
        measurements: []
      };
      
      (Patient.findByPk as jest.Mock).mockResolvedValue(mockPatient);
      
      const response = await request(app)
        .get('/api/patients/1')
        .expect(200);
      
      expect(response.body).toEqual(mockPatient);
      expect(Patient.findByPk).toHaveBeenCalledWith('1', {
        include: [{ model: Measurement, as: 'measurements' }]
      });
    });

    it('should return 404 if patient not found', async () => {
      (Patient.findByPk as jest.Mock).mockResolvedValue(null);
      
      const response = await request(app)
        .get('/api/patients/999')
        .expect(404);
      
      expect(response.body).toHaveProperty('message', 'Paciente não encontrado');
    });
  });

  describe('POST /api/patients/:id/measurements', () => {
    it('should add a measurement to a patient', async () => {
      const mockPatient = {
        id: 1,
        name: 'Paciente 1',
        birthDate: '2020-01-01'
      };
      
      const measurementData = {
        width: 100,
        length: 150,
        diagonalA: 180,
        diagonalB: 175
      };
      
      const createdMeasurement = {
        id: 1,
        patientId: 1,
        ...measurementData,
        ci: 66.67,
        cvai: 2.86,
        classification: 'Normal'
      };
      
      (Patient.findByPk as jest.Mock).mockResolvedValue(mockPatient);
      (Measurement.validateMeasurements as jest.Mock).mockReturnValue(null);
      (Measurement.create as jest.Mock).mockResolvedValue(createdMeasurement);
      
      const response = await request(app)
        .post('/api/patients/1/measurements')
        .send(measurementData)
        .expect(201);
      
      expect(response.body).toEqual(createdMeasurement);
      expect(Patient.findByPk).toHaveBeenCalledWith('1');
      expect(Measurement.create).toHaveBeenCalled();
    });

    it('should validate measurements', async () => {
      const mockPatient = {
        id: 1,
        name: 'Paciente 1',
        birthDate: '2020-01-01'
      };
      
      const invalidMeasurementData = {
        width: 0,
        length: 150,
        diagonalA: 180,
        diagonalB: 175
      };
      
      (Patient.findByPk as jest.Mock).mockResolvedValue(mockPatient);
      (Measurement.validateMeasurements as jest.Mock).mockReturnValue('Medidas inválidas');
      
      const response = await request(app)
        .post('/api/patients/1/measurements')
        .send(invalidMeasurementData)
        .expect(400);
      
      expect(response.body).toHaveProperty('message', 'Medidas inválidas');
      expect(Measurement.create).not.toHaveBeenCalled();
    });
  });
});
