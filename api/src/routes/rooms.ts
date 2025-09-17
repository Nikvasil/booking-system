import { Router, Request, Response } from 'express';
import { query } from '../db';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
    try {
        const rooms = await query('SELECT * FROM rooms ORDER BY name ASC');
        res.json(rooms.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching rooms.' });
    }
});

export default router;