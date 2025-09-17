'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import BookingForm from './BookingForm';
import BookingList from './BookingList';

interface Room { id: number; name: string; }
export interface Booking { id: number; title: string; roomName: string; userEmail: string; startTime: string; endTime: string; }

export default function Dashboard() {
    const { token, logout } = useAuth();
    const { apiFetch, error } = useApi(token);

    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const fetchData = async () => {
        try {
            const roomsData = await apiFetch('/rooms');
            setRooms(roomsData);
            const bookingsData = await apiFetch('/bookings');
            setBookings(bookingsData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBookingCreated = () => {
        fetchData();
    };

    const handleDeleteBooking = async (id: number) => {
        try {
            await apiFetch(`/bookings/${id}`, { method: 'DELETE' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Booking System</h1>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
                </header>
                {error && <p className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">{error}</p>}

                <BookingForm rooms={rooms} onBookingCreated={handleBookingCreated} />
                <BookingList bookings={bookings} onDelete={handleDeleteBooking} />
            </div>
        </div>
    );
}