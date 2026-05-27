import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendMessage } from './Controllers/sendMessage.js';
import { checkAvailability } from './Controllers/smoobu/checkAvailability.js';
import { listSmoobuApartments } from './Controllers/smoobu/listApartments.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// POST /api/whatsapp/send - delegate to controller
app.post('/api/whatsapp/send', sendMessage);

// Smoobu availability
app.get('/api/smoobu/availability', checkAvailability);

if (process.env.NODE_ENV !== 'production') {
  app.get('/api/smoobu/apartments', listSmoobuApartments);
}

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});


