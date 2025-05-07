import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import walletRoutes from './routes/wallet';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', walletRoutes);

app.listen(PORT, () => {
  console.log(`🧠 Backend API running on http://localhost:${PORT}`);
});
