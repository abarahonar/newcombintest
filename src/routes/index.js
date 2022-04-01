const express = require("express");

const router = express.Router();

router.use("/payables", require("../api/rest/payables"));
router.use("/transactions", require("../api/rest/transactions"));

module.exports = router;
