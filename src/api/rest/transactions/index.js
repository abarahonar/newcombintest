const express = require("express");
const Transaction = require("./service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await Transaction.post(req.body);
    res.status(200).send(response);
  } catch(e) {
    res.status(500).send({message: e});
  }
})

router.get("/", async (req, res) => {
  try {
    res.status(200).send(await Transaction.get(req.query.init_date, req.query.end_date));
  } catch (err) {
    res.status(500).send({message:err});
  }
})

module.exports = router;
