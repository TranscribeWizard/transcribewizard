const express = require("express");
const app = express();
const cors = require("cors");

const dotenv = require("dotenv");
const transcribeserviceRouter = require("./routes/transcribeserviceRouter");

const errorMiddlewear = require("./middleware/error");
dotenv.config();

const PORT = process.env.PORT || 5001;

// Handling uncaught expections

process.on("uncaughtException", (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.log(`Stack: ${err.stack}`);
  console.log("Shutting Down The Server Due To Uncaught Exception");
  process.exit(1);
})


app.use(express.json());
app.use(cors());
app.use(errorMiddlewear);

app.get("/", (req, res) => res.send("Hello World!"));

app.use("/api/v1/transcribe", transcribeserviceRouter);


const server = app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});


//  Handling unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  console.log(`Stack: ${err.stack}`);
  console.log("Shutting Down The Server Due To Unhandled Promise Rejection");

  server.close(() => process.exit(1));
})