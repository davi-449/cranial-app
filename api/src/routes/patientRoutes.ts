import { Router } from 'express';
import PatientController from '../controllers/PatientController';

const router = Router();
const patientController = new PatientController();

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Cria um novo paciente
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthDate
 *             properties:
 *               name:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Paciente criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', patientController.create);

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Lista todos os pacientes
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */
router.get('/', patientController.findAll);

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Obtém um paciente pelo ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Dados do paciente
 *       404:
 *         description: Paciente não encontrado
 */
router.get('/:id', patientController.findOne);

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Atualiza um paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Paciente atualizado com sucesso
 *       404:
 *         description: Paciente não encontrado
 */
router.put('/:id', patientController.update);

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Remove um paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Paciente removido com sucesso
 *       404:
 *         description: Paciente não encontrado
 */
router.delete('/:id', patientController.delete);

/**
 * @swagger
 * /api/patients/{id}/measurements:
 *   post:
 *     summary: Adiciona uma nova medição para um paciente
 *     tags: [Measurements]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - width
 *               - length
 *               - diagonalA
 *               - diagonalB
 *             properties:
 *               width:
 *                 type: number
 *               length:
 *                 type: number
 *               diagonalA:
 *                 type: number
 *               diagonalB:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Medição adicionada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Paciente não encontrado
 */
router.post('/:id/measurements', patientController.addMeasurement);

/**
 * @swagger
 * /api/patients/{id}/report:
 *   get:
 *     summary: Gera um relatório de medições para um paciente
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do paciente
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *       404:
 *         description: Paciente não encontrado
 */
router.get('/:id/report', patientController.generateReport);

export default router;
