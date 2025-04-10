import { Router } from 'express';
import patientRoutes from './patientRoutes';

const router = Router();

// Rotas de pacientes
router.use('/patients', patientRoutes);

export default router;
