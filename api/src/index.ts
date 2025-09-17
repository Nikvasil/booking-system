import './db';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import authRouter from './routes/auth';
import bookingsRouter from './routes/bookings';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
    res.send('Hello from the TypeScript Booking System API! 👋');
});

app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});