import { Router, Request, Response } from 'express';
import { query } from '../db';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', async (req: Request, res: Response) => {
    const { title, roomId, startTime, endTime } = req.body;
    const userId = req.user?.id;

    if (!title || !roomId || !startTime || !endTime) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newBooking = await query(
            `INSERT INTO bookings (title, room_id, user_id, booking_range)
       VALUES ($1, $2, $3, tstzrange($4, $5, '[]'))
       RETURNING id, title, room_id, user_id, lower(booking_range) as "startTime", upper(booking_range) as "endTime"`,
            [title, roomId, userId, startTime, endTime]
        );

        res.status(201).json(newBooking.rows[0]);
    } catch (error: any) {
        if (error.code === '23P01') {
            return res.status(409).json({ message: 'This room is already booked for the selected time range.' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error while creating booking.' });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const allBookings = await query(
            `SELECT
          b.id,
          b.title,
          b.room_id,
          r.name as "roomName",
          b.user_id,
          u.email as "userEmail",
          lower(b.booking_range) as "startTime",
          upper(b.booking_range) as "endTime"
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       ORDER BY "startTime" ASC`
        );

        res.json(allBookings.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    const bookingId = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    if (isNaN(bookingId)) {
        return res.status(400).json({ message: 'Invalid booking ID.' });
    }

    try {
        const deleteResult = await query(
            'DELETE FROM bookings WHERE id = $1 AND user_id = $2 RETURNING id',
            [bookingId, userId]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ message: 'Booking not found or you do not have permission to delete it.' });
        }

        res.status(200).json({ message: 'Booking deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting booking.' });
    }
});


export default router;