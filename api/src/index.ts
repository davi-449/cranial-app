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
const PORT = Number(process.env.PORT || 3000);

// Middlewares
app.use(cors({
  origin: '*', // Permite acesso de qualquer origem
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  contentSecurityPolicy: false // Desabilita para permitir o Swagger UI funcionar corretamente
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desenvolvimento',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Rota de teste para verificar se a API está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API de Medições Cranianas está funcionando!' });
});

// Rotas da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/auth', authRoutes);
app.use('/api', routes);

// Rota para verificar se o endpoint /api está funcionando
app.get('/api', (req, res) => {
  res.json({ message: 'Endpoint /api está funcionando!' });
});

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync()
  .then(() => {
    console.log('Banco de dados sincronizado');
    
    // Inicia o servidor apenas após a sincronização do banco de dados
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Acesse a documentação da API em http://localhost:${PORT}/api-docs`);
      console.log(`Acesse a API em http://localhost:${PORT}/api`);
    });
  })
  .catch(error => {
    console.error('Erro ao sincronizar o banco de dados:', error);
  });

export default app;
