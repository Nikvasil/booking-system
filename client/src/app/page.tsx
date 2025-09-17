'use client';

import { useState, useEffect, FormEvent } from 'react';

interface Room {
  id: number;
  name: string;
  capacity: number;
}

interface Booking {
  id: number;
  title: string;
  roomId: number;
  roomName: string;
  userEmail: string;
  startTime: string;
  endTime: string;
}

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookingTitle, setBookingTitle] = useState('');
  const [bookingRoomId, setBookingRoomId] = useState('');
  const [bookingStartTime, setBookingStartTime] = useState(new Date().toISOString().slice(0, 16));
  const [bookingEndTime, setBookingEndTime] = useState(
      new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)
  );

  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchRooms();
      fetchBookings();
    }
  }, [token]);


  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/rooms`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch rooms');
      const data = await res.json();
      setRooms(data);
      if (data.length > 0) setBookingRoomId(data[0].id.toString());
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      setBookings(await res.json());
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('authToken', data.token);
      setToken(data.token);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setBookings([]);
    setRooms([]);
  };

  const handleCreateBooking = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: bookingTitle,
          roomId: parseInt(bookingRoomId),
          startTime: new Date(bookingStartTime).toISOString(),
          endTime: new Date(bookingEndTime).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create booking');

      fetchBookings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteBooking = async (id: number) => {
    setError('');
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete booking');

      fetchBookings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!token) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    required
                />
              </div>
              <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
              {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
            </form>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Booking System</h1>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </header>

          {error && <p className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">{error}</p>}

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Create a Booking</h2>
            <form onSubmit={handleCreateBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                  type="text"
                  placeholder="Booking Title"
                  value={bookingTitle}
                  onChange={(e) => setBookingTitle(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  required
              />
              <select
                  value={bookingRoomId}
                  onChange={(e) => setBookingRoomId(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  required
              >
                {rooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.name}</option>
                ))}
              </select>
              <input
                  type="datetime-local"
                  value={bookingStartTime}
                  onChange={(e) => setBookingStartTime(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  required
              />
              <input
                  type="datetime-local"
                  value={bookingEndTime}
                  onChange={(e) => setBookingEndTime(e.target.value)}
                  className="px-3 py-2 border rounded-lg"
                  required
              />
              <button type="submit" className="md:col-span-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                Create Booking
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Current Bookings</h2>
            <ul className="space-y-4">
              {bookings.map((booking) => (
                  <li key={booking.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">{booking.title} ({booking.roomName})</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Booked by: {booking.userEmail}</p>
                    </div>
                    <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  );
}