# NewCombin technical challenge

Technologies used:

* Node.js 16.14.0
* Docker 20.10.14
* Fedora 35

## How to execute

### PostgreSQL docker instance

The database is containerized. In order to run it, run the following commands in order in the root of the project:

```bash
docker pull postgres:alpine # To pull the image

# This works only on UNIX based systems (due to $PWD)
docker run \
  --name newCombinPostgres \
  --env-file docker.env \
  --detach \
  --publish "5432:5432" \
  --volume "${PWD}/config/postgres:/docker-entrypoint-initdb.d" \
  --rm \
  postgres:alpine # To run the container
```

### Node server

To run the node.js server, run `npm run start` in the root of the project.

## To test it

An automated test can be found in the `test.sh` file. For this file to run, curl and jq are needed. To run it,
run `source test.sh`. In the next sections each endpoint is explained and a curl command is given to test it.

### 1st endpoint

`POST /api/rest/payables`. This request has to be made with the application/json Content-Type header. Every field of the
object is mandatory. The possible values for `payment_status` are: pending and paid.

```bash
curl -X POST localhost:3000/api/rest/payables \
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
  '
```

### 2nd endpoint

`POST /api/rest/transactions`. This request has to be made with the application/json Content-Type header.
The `card_number`
field is mandatory only if credit_card or debit_card is used as `payment_method`. The possible values
for `payment_method` are: credit_card, credit_card, and cash. The `card_number` should always be a 16 characters string.

```bash
curl -X POST localhost:3000/api/rest/transactions \
  -H 'Content-Type: application/json' \
  -d '
    {
      "barcode": "0000000000011",
      "payment_method": "debit_card",
      "payment_import": 123,
      "payment_date": "03/26/2022",
      "card_number": "0000000010000000"
    }
  '
```

### 3rd enpoint

`GET /api/rest/payables?service_type=`. The  `service_type` parameter is optional.

```bash
curl localhost:3000/api/rest/payables?service_type=water # with a filter
curl localhost:3000/api/rest/payables # with no filter
```

### 4th endpoint

`GET /api/rest/transactions?init_date=&end_date`. The `init_date` and `end_date` are mandatory.

```bash
curl 'localhost:3000/api/rest/transactions?init_date=02/20/2022&end_date=05/01/2022'
```

## Considerations

* All the dates are in the format mm/dd/yyyy. This is enforced by the server.
* This was run in a UNIX based system, so a UNIX based system is recommended for it to run.
* The `barcode` follows the EAN-13 barcode standard of 13 numerical characters to denote a barcode. Because of this, the
  barcode should always be a 13 characters string.
* All payments should be positive numbers.
* The port 3000 is used by default. unless the `PORT` environmental variable is set.
* Some test entries are loaded into the database. The entries have the following characteristics:
    * 9 payables entries, with service_type: gas, water, and electricity.
    * 9 transactions entries, with payment date ranging from 02/15/2022 to 05/07/2022.
