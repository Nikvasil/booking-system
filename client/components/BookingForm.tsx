'use client';

import { useState, useEffect, FormEvent, FC } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

interface Room {
    id: number;
    name: string;
}

interface BookingFormProps {
    rooms: Room[];
    onBookingCreated: () => void;
}

const BookingForm: FC<BookingFormProps> = ({ rooms, onBookingCreated }) => {
    const { token } = useAuth();
    const { apiFetch, error, setError } = useApi(token);

    const [title, setTitle] = useState('');
    const [roomId, setRoomId] = useState('');

    const [startTime, setStartTime] = useState(new Date().toISOString().slice(0, 16));
    const [endTime, setEndTime] = useState(
        new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
    );

    useEffect(() => {
        if (rooms.length > 0 && !roomId) {
            setRoomId(rooms[0].id.toString());
        }
    }, [rooms]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (new Date(endTime) <= new Date(startTime)) {
            setError('End time must be after start time.');
            return;
        }

        try {
            await apiFetch('/bookings', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    roomId: parseInt(roomId),
                    startTime: new Date(startTime).toISOString(),
                    endTime: new Date(endTime).toISOString(),
                }),
            });
            setTitle('');
            onBookingCreated();
        } catch (err) {
            console.error('Failed to create booking:', err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Create a Booking</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Booking Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    required
                />
                <select
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    required
                >
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>{room.name}</option>
                    ))}
                </select>
                <div>
                    <label htmlFor="start-time" className="text-sm font-medium text-gray-600">Start Time</label>
                    <input
                        id="start-time"
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="end-time" className="text-sm font-medium text-gray-600">End Time</label>
                    <input
                        id="end-time"
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <button type="submit" className="md:col-span-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Create Booking
                </button>
                {error && <p className="md:col-span-2 text-red-500 text-center">{error}</p>}
            </form>
        </div>
    );
};

export default BookingForm;