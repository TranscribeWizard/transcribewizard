const express = require("express");
const app = express();

// const server = require("http").createServer(app);
// const io = require("socket.io")(server);

const cors = require("cors");
const dotenv = require("dotenv");
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


app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/v1/transcribe", transcribeserviceRouter);


const mainserver = app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});

// io.on('connection', (socket) => {
//   console.log('user connected');
//   socket.on('disconnect', function () {
//     console.log('user disconnected');
//   });
// })

app.use(errorMiddlewear);



//  Handling unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Stack: ${err.stack}`);
  console.log("Shutting Down The Server Due To Unhandled Promise Rejection");

  mainserver.close(() => process.exit(1));
})