--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrators; Type: TABLE; Schema: public; Owner: noah
--

CREATE TABLE public.administrators (
    admin_id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.administrators OWNER TO noah;

--
-- Name: administrators_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: noah
--

CREATE SEQUENCE public.administrators_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.administrators_admin_id_seq OWNER TO noah;

--
-- Name: administrators_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noah
--

ALTER SEQUENCE public.administrators_admin_id_seq OWNED BY public.administrators.admin_id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: noah
--

CREATE TABLE public.customers (
    customer_id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone_number character varying(20),
    address text,
    is_registered boolean DEFAULT false
);


ALTER TABLE public.customers OWNER TO noah;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: noah
--

CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_customer_id_seq OWNER TO noah;

--
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noah
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- Name: games; Type: TABLE; Schema: public; Owner: noah
--

CREATE TABLE public.games (
    game_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    platform character varying(20),
    genre character varying(100),
    developer character varying(255),
    stock_quantity integer NOT NULL,
    release_date date,
    rating_average double precision DEFAULT 0.0,
    CONSTRAINT games_platform_check CHECK (((platform)::text = ANY ((ARRAY['PC'::character varying, 'PS5'::character varying, 'Xbox'::character varying, 'Switch'::character varying])::text[]))),
    CONSTRAINT games_stock_quantity_check CHECK ((stock_quantity >= 0))
);


ALTER TABLE public.games OWNER TO noah;

--
-- Name: games_game_id_seq; Type: SEQUENCE; Schema: public; Owner: noah
--

CREATE SEQUENCE public.games_game_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.games_game_id_seq OWNER TO noah;

--
-- Name: games_game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noah
--

ALTER SEQUENCE public.games_game_id_seq OWNED BY public.games.game_id;


--
-- Name: library; Type: TABLE; Schema: public; Owner: noah
--

CREATE TABLE public.library (
    library_id integer NOT NULL,
    game_id integer,
    game_added date DEFAULT CURRENT_DATE,
    game_removed date,
    date_modified date DEFAULT CURRENT_DATE
);


ALTER TABLE public.library OWNER TO noah;

--
-- Name: library_library_id_seq; Type: SEQUENCE; Schema: public; Owner: noah
--

CREATE SEQUENCE public.library_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.library_library_id_seq OWNER TO noah;

--
-- Name: library_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noah
--

ALTER SEQUENCE public.library_library_id_seq OWNED BY public.library.library_id;


--
-- Name: order_details; Type: TABLE; Schema: public; Owner: noah
--

CREATE TABLE public.order_details (
    order_detail_id integer NOT NULL,
    order_id integer,
    game_id integer,
    quantity integer NOT NULL,
    price_at_purchase numeric(10,2) NOT NULL,
    CONSTRAINT order_details_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.order_details OWNER TO noah;

--
-- Name: order_details_order_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: noah
--

CREATE SEQUENCE public.order_details_order_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_details_order_detail_id_seq OWNER TO noah;

--
-- Name: order_details_order_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noah
--

ALTER SEQUENCE public.order_details_order_detail_id_seq OWNED BY public.order_details.order_detail_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: noah
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    customer_id integer,
    order_date date DEFAULT CURRENT_DATE,
    total_price numeric(10,2) NOT NULL,
    order_status character varying(20),
    payment_method character varying(20),
    transaction_id integer,
    CONSTRAINT orders_order_status_check CHECK (((order_status)::text = ANY ((ARRAY['Processing'::character varying, 'Completed'::character varying, 'Canceled'::character varying])::text[]))),
    CONSTRAINT orders_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['Credit Card'::character varying, 'PayPal'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO noah;

--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: noah
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_order_id_seq OWNER TO noah;

--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noah
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: noah
--

CREATE TABLE public.payments (
    transaction_id integer NOT NULL,
    order_id integer,
    payment_date date DEFAULT CURRENT_DATE,
    payment_status character varying(20),
    amount_paid numeric(10,2) NOT NULL,
    CONSTRAINT payments_amount_paid_check CHECK ((amount_paid >= (0)::numeric)),
    CONSTRAINT payments_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['Pending'::character varying, 'Successful'::character varying, 'Failed'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO noah;

--
-- Name: payments_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: noah
--

CREATE SEQUENCE public.payments_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_transaction_id_seq OWNER TO noah;

--
-- Name: payments_transaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noah
--

ALTER SEQUENCE public.payments_transaction_id_seq OWNED BY public.payments.transaction_id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: noah
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    customer_id integer,
    game_id integer,
    rating integer NOT NULL,
    review_text text,
    review_date date DEFAULT CURRENT_DATE,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO noah;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: noah
--

CREATE SEQUENCE public.reviews_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_review_id_seq OWNER TO noah;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: noah
--

ALTER SEQUENCE public.reviews_review_id_seq OWNED BY public.reviews.review_id;


--
-- Name: administrators admin_id; Type: DEFAULT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.administrators ALTER COLUMN admin_id SET DEFAULT nextval('public.administrators_admin_id_seq'::regclass);


--
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- Name: games game_id; Type: DEFAULT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.games ALTER COLUMN game_id SET DEFAULT nextval('public.games_game_id_seq'::regclass);


--
-- Name: library library_id; Type: DEFAULT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.library ALTER COLUMN library_id SET DEFAULT nextval('public.library_library_id_seq'::regclass);


--
-- Name: order_details order_detail_id; Type: DEFAULT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.order_details ALTER COLUMN order_detail_id SET DEFAULT nextval('public.order_details_order_detail_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: payments transaction_id; Type: DEFAULT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.payments ALTER COLUMN transaction_id SET DEFAULT nextval('public.payments_transaction_id_seq'::regclass);


--
-- Name: reviews review_id; Type: DEFAULT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.reviews ALTER COLUMN review_id SET DEFAULT nextval('public.reviews_review_id_seq'::regclass);


--
-- Name: administrators administrators_email_key; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_email_key UNIQUE (email);


--
-- Name: administrators administrators_pkey; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_pkey PRIMARY KEY (admin_id);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);


--
-- Name: library library_pkey; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.library
    ADD CONSTRAINT library_pkey PRIMARY KEY (library_id);


--
-- Name: order_details order_details_pkey; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (order_detail_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (transaction_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: library library_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.library
    ADD CONSTRAINT library_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;


--
-- Name: order_details order_details_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;


--
-- Name: order_details order_details_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id) ON DELETE CASCADE;


--
-- Name: reviews reviews_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: noah
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(game_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

