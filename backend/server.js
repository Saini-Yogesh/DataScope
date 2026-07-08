import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRouter from './routes/api.js';
import { errorHandler } from './middlewares/error.js';

// Load environment configurations
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing for the React frontend
app.use(cors({
  origin: '*', // Allow all origins for easier local/enterprise environments
  credentials: true
}));

// HTTP Request logging
app.use(morgan('dev'));

// Payload parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base check route
app.get('/', (req, res) => {
  const hasLiveCreds = process.env.DATABRICKS_HOST && process.env.DATABRICKS_TOKEN;
  res.json({
    status: 'success',
    message: 'DataAtlas Backend API Server is running',
    version: '1.0.0',
    mode: hasLiveCreds ? 'Live Workspace' : 'Simulation'
  });
});

// API Gateway routes
app.use('/api', apiRouter);

// Centralized error boundary
app.use(errorHandler);

// Launch server listener
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    const hasLiveCreds = process.env.DATABRICKS_HOST && process.env.DATABRICKS_TOKEN;
    const mode = hasLiveCreds ? `Live Workspace (${process.env.DATABRICKS_HOST})` : 'Simulation';
    console.log(`=============================================`);
    console.log(`🚀 DataAtlas Metadata Server Running on port ${PORT}`);
    console.log(`👉 API Endpoints: http://localhost:${PORT}/api`);
    console.log(`🛠️  Mode: ${mode}`);
    console.log(`=============================================`);
  });
}

export default app;
