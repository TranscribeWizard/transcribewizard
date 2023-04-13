const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const fs = require('fs')
const cors = require("cors");
const dotenv = require("dotenv");
const { createWebSocketServer } = require("./src/utils/webSocket");
dotenv.config();
const errorMiddlewear = require("./src/middleware/error");
const transcribeserviceRouter = require("./src/routes/transcribeserviceRouter");
const PORT = process.env.PORT || 5001;

// Handling uncaught expections

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Stack: ${err.stack}`);
  console.log("Shutting Down The Server Due To Uncaught Exception");
  process.exit(1);
})

createWebSocketServer(server);

fs.mkdirSync('media/uploads', { recursive: true })
fs.mkdirSync('media/transcriptions', { recursive: true })

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/socket", (req, res) => res.sendStatus(200));
app.use("/api/v1/transcribe", transcribeserviceRouter);


const mainserver = server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});



app.use(errorMiddlewear);



//  Handling unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Stack: ${err.stack}`);
  console.log("Shutting Down The Server Due To Unhandled Promise Rejection");

  mainserver.close(() => process.exit(1));
})