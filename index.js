const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config()

//requireing http and socket.io dependencies
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = 3005;

app.use(express.static(__dirname));
//BodyParser MIddleware
app.use(express.urlencoded({ extended: true }));

//Json parser
app.use(express.json());


var Message = mongoose.model("Message", { name: String, message: String });

const dbUrl = process.env.DBURL

app.get("/messages", async (req, res) => {
  const messageData = await Message.find().lean();
  res.send(messageData);
});

app.post("/messages", async (req, res) => {
  var message = new Message(req.body);
  await message.save();

  //
  io.emit('message', req.body)
  res.send(message);
});


io.on('connection', () => {
  console.log('User Connected');
})

mongoose.connect(
  dbUrl,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("DB connection Successfull");
    } else {
      console.log(err);
      console.log("DB connection failed");
    }
  }
);

http.listen(port, () => {
  console.log(`Server Listeningf at ${port} `);
});