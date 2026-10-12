# Lost & Found Platform

This is a web application for reporting and finding lost items. Users can report lost or found items, search for items, view item details, and update the item status.

## Features

* User Registration and Login
* User Dashboard and Profile
* Report Lost Item
* Report Found Item
* Search and Filter Items
* View Item Details
* Update Item Status
* Contact Information
* Lost and Found Item Matching
* Admin Dashboard
* Admin Approval and Rejection
* Remove Invalid Reports
* View Claimed and Closed Items

## Matching

When a found item is reported, the system checks the existing lost items and displays possible matches.

The matching is based on category, location, date, and keywords from the item details.

## Technologies Used

* React
* Vite
* JavaScript
* CSS
* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* bcryptjs

## Database

MongoDB Atlas is used to store user details and lost/found item details.

The main collections are:

* User
* Item

## How to Run

### Frontend

Open the frontend folder in the terminal and run:

```bash
npm install
npm run dev
```

### Backend

Open the backend folder in another terminal and run:

```bash
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

The frontend URL is shown by Vite in the terminal.

## MongoDB Configuration

The MongoDB connection string and JWT secret are stored in the backend `.env` file.

Example:

```text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## Admin

The application has a separate admin account.

The admin can view reports, approve or reject reports, remove reports, and view claimed or closed items.

## Assumptions

* Item images are optional.
* A simple rule-based method is used for matching lost and found items.
* MongoDB Atlas is used for the database.
* Deployment is not required.
