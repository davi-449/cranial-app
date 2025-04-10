import express from 'express';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import sequelize from './config/database';

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa o Express
const app = express();
const port = process.env.PORT || 4000;

// Middleware para processar JSON
// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registrar as rotas de autenticação
app.use('/api/auth', authRoutes);
// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Medições Cranianas',
      version: '1.0.0',
      description: 'API para gerenciamento de pacientes e medições cranianas',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Servidor de desenvolvimento',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/api', routes);

// Sincroniza o banco de dados
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado');
});



export default app;

