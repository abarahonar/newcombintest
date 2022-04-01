curl -s localhost:3000/api/rest/payables?service_type=water | jq .
curl -s localhost:3000/api/rest/payables | jq .
curl -s 'localhost:3000/api/rest/transactions?init_date=02/20/2022&end_date=05/01/2022' | jq .
curl -s -X POST localhost:3000/api/rest/payables \
  -H 'Content-Type: application/json' \
  -d '
    {
      "barcode": "0000000000011",
      "service_type": "water",
      "description": "Aguas andinas",
      "due_date": "04/14/2022",
      "service_import": 254,
      "payment_status": "pending"
    }
  ' | jq .
curl -s -X POST localhost:3000/api/rest/transactions \
  -H 'Content-Type: application/json' \
  -d '
    {
      "barcode": "0000000000011",
      "payment_method": "debit_card",
      "payment_import": 123,
      "payment_date": "03/26/2022",
      "card_number": "0000000010000000"
    }
  ' | jq .
