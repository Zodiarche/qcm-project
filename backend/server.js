import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import emailRoutes from './routes/emailRoutes.js';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', emailRoutes);

app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
