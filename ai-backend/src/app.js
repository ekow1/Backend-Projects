import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './middleware/logger.js';
import chatRoutes from './routes/chatRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';

dotenv.config();

const app = express();

app.use(cors(
  {
    origin: ['http://localhost:3000', 'http://localhost:8000','http://192.168.203.54:5000'],
    credentials: true,
  }
));
app.use(express.json());
app.use(logger);

app.use('/api', chatRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app; 