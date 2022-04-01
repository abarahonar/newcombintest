const pool = require("../../../database/postgres");
const is_valid_date = require("../../utils/dates");

const transaction_properties = [
  "payment_method",
  "payment_import",
  "barcode",
  "payment_date",
];
const payment_method_enum = ["debit_card", "credit_card", "cash"];
const post_query = "INSERT INTO transactions(payment_method, card_number, payment_import, barcode, payment_date) VALUES ($1, $2, $3, $4, $5) RETURNING *";
const get_query = "SELECT TO_CHAR(payment_date, 'mm/dd/yyyy'), SUM (payment_import) AS accumulated_import, COUNT (*) AS transactions_quantity FROM transactions WHERE payment_date BETWEEN $1 AND $2 GROUP BY payment_date"

async function post(body) {
  if (!transaction_properties.every(key => key in body)) {
    throw "Missing property";
  } if (!payment_method_enum.includes(body.payment_method)) {
    throw "Invalid payment method";
  } if (body.payment_import < 0) {
    throw "Negative payment import";
  } if (!is_valid_date(body.payment_date)) {
    throw "Invalid payment date";
  } if (typeof body.barcode != "string" || body.barcode.length !== 13) {
    throw "Invalid barcode";
  } if (body.payment_method !== "cash" && ! ("card_number" in body)) {
    throw "No card number";
  } if (body.payment_method !== "cash" && body.card_number.length !== 16) {
    throw "Invalid card number";
  }
  const response = await pool.query(
    post_query,
    [body.payment_method, body.card_number, body.payment_import, body.barcode, body.payment_date]
  );
  return response.rows[0];
}

async function get(init_date, end_date) {
  const response = await pool.query(get_query, [init_date, end_date]);
  return response.rows;
}

module.exports = {get, post};
