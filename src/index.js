const express = require("express");
const cors = require("cors");
const router = require("./routes");

require("dotenv").config({path: "./node.env"});  // Load .env

const port = process.env.PORT || 3000;

const app = express();
app.use(cors())  // Even though this is dangerous, it is necessary in this context
app.use(express.json());
app.use("/api/rest", router)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
