Game Store Web App

A full-stack web application that allows users to browse, search, review, and purchase video games. Built for a database course project with user authentication, admin controls, and PostgreSQL integration.
Features

    User login and signup

    Game search and filtering

    Review submission with ratings (1–5)

    Game detail pages with reviews and purchase option

    Mock purchase system

    Admin-only features:

        Add a new game

        Delete any game

    Clicking “Game Store” resets the game list to original results

Tech Stack

    Frontend: React.js (Vite), React Router

    Backend: Express.js and Node.js

    Database: PostgreSQL

    Styling: CSS

    ORM: pg (raw SQL)

Setup Instructions
Prerequisites

    Node.js and npm

    PostgreSQL installed and running locally

1. Set up the database

From the root project directory, run:

psql -d gamestore -f SQLsetup.txt

Insert mock data (replace the file names as needed):

\copy customers(name, email, password, phone_number, address, is_registered) FROM 'mock data/customers.csv' DELIMITER ',' CSV HEADER;

(repeat this for each CSV file)

Reset all sequences:

SELECT setval('customers_customer_id_seq', (SELECT MAX(customer_id) FROM customers));
SELECT setval('orders_order_id_seq', (SELECT MAX(order_id) FROM orders));
SELECT setval('order_details_order_detail_id_seq', (SELECT MAX(order_detail_id) FROM order_details));
SELECT setval('payments_transaction_id_seq', (SELECT MAX(transaction_id) FROM payments));
SELECT setval('reviews_review_id_seq', (SELECT MAX(review_id) FROM reviews));
SELECT setval('administrators_admin_id_seq', (SELECT MAX(admin_id) FROM administrators));
SELECT setval('library_library_id_seq', (SELECT MAX(library_id) FROM library));
SELECT setval('games_game_id_seq', (SELECT MAX(game_id) FROM games));
2. Start the backend server

cd backend
npm install
node server.js

This runs on http://localhost:5001
3. Start the frontend

cd frontend
npm install
npm run dev

This runs on http://localhost:5173
Usage

    Sign up or log in as a user

    Search or browse games

    Click on a game to view its details and leave a review

    Click "Purchase" to mock-buy a game

    Admins can add or delete games

    Clicking “Game Store” in the header resets the game list

Let me know if you need a downloadable version or want to include instructions for deployment.