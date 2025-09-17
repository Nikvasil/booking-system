# Meeting Room Booking System

A simple yet robust full-stack application for booking meeting rooms in an office building. This project was built as a solution to a technical test task.

It features a secure backend API built with Node.js/Express and a reactive frontend built with React/Next.js. The core business logic—preventing double bookings—is handled at the database level for maximum data integrity.

-----

## Features

* **User Authentication**: Secure user signup and login using JWT (JSON Web Tokens).
* **Booking Management**: Authenticated users can create, view, and delete their bookings.
* **Overlap Prevention**: A room cannot be booked for a time that overlaps with an existing booking. This is enforced by a database constraint.
* **RESTful API**: A well-defined API for managing users and bookings.
* **Interactive UI**: A simple, clean user interface built with React and Next.js for managing bookings.
* **Validation**: Server-side input validation using Zod to ensure data integrity.

-----

## Tech Stack

* **Frontend**: React, Next.js, TypeScript, Tailwind CSS
* **Backend**: Node.js, Express, TypeScript
* **Database**: PostgreSQL

-----

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

* **Node.js**: v18.x or later. [Download Node.js](https://nodejs.org/)
* **PostgreSQL**: A running instance of PostgreSQL. [Download PostgreSQL](https://www.postgresql.org/download/)

### 1\. Installation

First, clone the repository to your local machine:

```bash
git clone <your-repo-url>
cd booking-system
```

Next, install the dependencies for both the backend and frontend.

```bash
cd api
npm install

cd ../client
npm install
```

### 2\. Database Setup

You need to create a database:

Connect to PostgreSQL with `psql` or a GUI tool and run the following commands:

```sql
CREATE DATABASE booking_system;
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE booking_system TO myuser;
```

Next, run the schema script from your project's **root directory** to create all the necessary tables and add initial data to both databases.

```bash
psql -U myuser -d booking_system -f api/schema.sql
```

### 3\. Environment Variables

The backend requires a `.env` file for configuration. In the `api` directory, copy the example file:

```bash
cp .env.example .env
```

Now, open the new `.env` file and fill in your actual database credentials and a unique `JWT_SECRET`.

### 4\. Running the Application

You'll need two separate terminals to run the backend and frontend servers.

**Terminal 1: Start the Backend API**

```bash
cd api
npm run dev
```

The API server will be running on `http://localhost:3001`.

**Terminal 2: Start the Frontend App**

```bash
cd client
npm run dev
```

The frontend application will be available at `http://localhost:3000`.

-----

## Core Logic: Preventing Double Bookings

A key requirement of this project is to prevent a room from being booked for overlapping times. This is enforced at the **database layer** for maximum reliability and performance.

### The Solution: `EXCLUDE` Constraint

Instead of checking for overlaps in the application code (which can lead to race conditions), we use PostgreSQL's powerful built-in features.

1.  **`TSTZRANGE` Data Type**: We store the `start_time` and `end_time` in a single column called `booking_range` using the `TSTZRANGE` (timestamp with time zone range) data type. This treats a booking's duration as a single, atomic piece of data.

2.  **`EXCLUDE` Constraint with `GIST` Index**: This is the core of the logic. We add a constraint to the `bookings` table:

    ```sql
    CONSTRAINT no_overlapping_bookings
    EXCLUDE USING GIST (room_id WITH =, booking_range WITH &&)
    ```

    This constraint tells the database: "Do not allow a new row to be inserted if its `room_id` is the same (`=`) as an existing row's `room_id` AND its `booking_range` overlaps (`&&`) with that existing row's `booking_range`."

### Why This Approach Is Better

* **Data Integrity**: The database is the single source of truth. The rule can never be bypassed, regardless of how many servers or clients are trying to make bookings.
* **Performance**: Checking for overlaps using a `GIST` index is extremely fast and efficient.
* **Simplicity**: The application code becomes much simpler. It just tries to insert a booking and gracefully handles a constraint violation error if the booking fails.

-----

## API Endpoints

| Method | Endpoint                    | Description                           | Auth Required |
| :----- | :-------------------------- | :------------------------------------ | :------------ |
| `POST` | `/api/auth/signup`          | Register a new user.                  | No            |
| `POST` | `/api/auth/login`           | Log in a user and get a JWT.          | No            |
| `GET`  | `/api/rooms`                | Get a list of all meeting rooms.      | Yes           |
| `GET`  | `/api/bookings`             | Get a list of all bookings.           | Yes           |
| `POST` | `/api/bookings`             | Create a new booking.                 | Yes           |
| `DELETE`| `/api/bookings/:id`         | Delete a booking you own.             | Yes           |