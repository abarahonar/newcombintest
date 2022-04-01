const pool = require("../../../database/postgres");
const is_valid_date = require("../../utils/dates");

const payable_properties = [
  "barcode",
  "service_type",
  "description",
  "due_date",
  "service_import",
  "payment_status",
];
const payment_status_enum = ["pending", "paid"];

const post_query = "INSERT INTO payables(barcode, service_type, description, due_date, service_import, payment_status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
const get_without_filter_query = "SELECT barcode, service_type, due_date, service_import FROM payables WHERE payment_status = 'pending'";
const get_with_filter_query = "SELECT barcode, due_date, service_import FROM payables WHERE payment_status = 'pending' and service_type = $1";


async function post(body) {
  if (!payable_properties.every(key => key in body)) {
    throw "Missing property";
  } if (!payment_status_enum.includes(body.payment_status)) {
    throw "Invalid payment status";
  } if (body.service_import < 0) {
    throw "Negative service import";
  } if (!is_valid_date(body.due_date)) {
    throw "Invalid due date";
  } if (typeof body.barcode != "string" || body.barcode.length !== 13) {
    throw "Invalid barcode";
  }
  const response = await pool.query(
    post_query,
    [body.barcode, body.service_type, body.description, body.due_date, body.service_import, body.payment_status]
  );
  return response.rows[0];
}

async function get_without_filter() {
  const response = await pool.query(get_without_filter_query);
  return response.rows;
}

async function get_with_filter(filter) {
  const response = await pool.query(get_with_filter_query, [filter]);
  return response.rows;
}

async function get(filter) {
  return filter == null ? await  get_without_filter() : await get_with_filter(filter);
}

module.exports = {get, post};
