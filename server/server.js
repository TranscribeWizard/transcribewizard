const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
const transcribeservice = require("./routes/transcribeservice");

const errorMiddlewear = require("./middleware/error");
dotenv.config();

const PORT = process.env.PORT || 5001;



app.use(express.json());
app.use(cors());
app.use(errorMiddlewear);

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/v1/transcribe", transcribeservice);


app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
