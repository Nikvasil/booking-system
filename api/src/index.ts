import 'dotenv/config';
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from the TypeScript Booking System API! 👋');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});