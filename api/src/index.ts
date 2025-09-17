import 'dotenv/config';
import './db';
import express, { Request, Response } from 'express';
import authRouter from './routes/auth';
import bookingsRouter from './routes/bookings';
import cors from 'cors';
import roomsRouter from './routes/rooms';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/rooms', roomsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});