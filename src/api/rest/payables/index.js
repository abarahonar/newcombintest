const express = require("express");
const Payables = require("./service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const response = await Payables.post(req.body);
    res.status(200).send(response);
  } catch(err) {
    res.status(500).send({message: err});
  }
})

router.get("/", async (req, res) => {
  try {
    res.status(200).send(await Payables.get(req.query.service_type));
  } catch (err) {
    res.status(500).send({message: err});
  }
})

module.exports = router;
