import express from 'express';
import serviceRouter from './router.js';

const app = express();
app.use(express.json());
app.use('/appointments', serviceRouter);

const PORT = process.env.APPOINTMENTS_SERVICE_PORT ?? process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Appointments service running on port ${PORT}`));