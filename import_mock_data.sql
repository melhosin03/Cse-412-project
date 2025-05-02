-- Import customers
\COPY customers(name, email, password, phone_number, address, is_registered)
FROM 'mock data/customers.csv' DELIMITER ',' CSV HEADER;

-- Import games
\COPY games(title, description, price, platform, genre, developer, stock_quantity, release_date)
FROM 'mock data/games.csv' DELIMITER ',' CSV HEADER;

-- Import payments
\COPY payments(payment_date, payment_status, amount_paid)
FROM 'mock data/payments.csv' DELIMITER ',' CSV HEADER;

-- Import orders
\COPY orders(customer_id, order_date, total_price, order_status, payment_method, transaction_id)
FROM 'mock data/orders.csv' DELIMITER ',' CSV HEADER;

-- Import order_details
\COPY order_details(order_id, game_id, quantity, price_at_purchase)
FROM 'mock data/order_details.csv' DELIMITER ',' CSV HEADER;

-- Import reviews
\COPY reviews(customer_id, game_id, rating, review_text, review_date)
FROM 'mock data/review.csv' DELIMITER ',' CSV HEADER;

-- Import administrators
\COPY administrators(name, email, password)
FROM 'mock data/administrators.csv' DELIMITER ',' CSV HEADER;

-- Import library
\COPY library(game_id, game_added, game_removed, date_modified)
FROM 'mock data/library.csv' DELIMITER ',' CSV HEADER;
