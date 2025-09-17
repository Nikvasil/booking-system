'use client';

import { FC } from 'react';

interface Booking {
    id: number;
    title: string;
    roomName: string;
    userEmail: string;
    startTime: string;
    endTime: string;
}

interface BookingListProps {
    bookings: Booking[];
    onDelete: (id: number) => void;
}

const BookingList: FC<BookingListProps> = ({ bookings, onDelete }) => {
    if (bookings.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-semibold mb-4">Current Bookings</h2>
                <p className="text-gray-500">No bookings found. Create one above!</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Current Bookings</h2>
            <ul className="space-y-4">
                {bookings.map((booking) => (
                    <li key={booking.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50">
                        <div>
                            <p className="font-bold text-lg text-gray-800">{booking.title} ({booking.roomName})</p>
                            <p className="text-sm text-gray-600">
                                {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Booked by: {booking.userEmail}</p>
                        </div>
                        <button
                            onClick={() => onDelete(booking.id)}
                            className="mt-2 sm:mt-0 bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 self-start sm:self-center transition-colors"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookingList;