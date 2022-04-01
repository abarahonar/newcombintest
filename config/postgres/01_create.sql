CREATE TABLE transactions
(
    transaction_id SERIAL PRIMARY KEY,
    payment_method PAYMENT NOT NULL,
    card_number VARCHAR(16),
    payment_import INTEGER NOT NULL CHECK(payment_import > 0),  -- cents are stored as integers (in case of US, EUR, etc)
    barcode        CHAR(13) NOT NULL, -- according to EAN-13
    payment_date   DATE NOT NULL
);

CREATE TABLE payables
(
    barcode        CHAR(13) UNIQUE NOT NULL PRIMARY KEY,
    service_type   VARCHAR NOT NULL,
    description    VARCHAR NOT NULL,
    due_date       DATE NOT NULL,
    service_import INTEGER NOT NULL CHECK (service_import > 0 ), -- cents are stored as integers (in case of US, EUR, etc)
    payment_status STATUS NOT NULL
);
