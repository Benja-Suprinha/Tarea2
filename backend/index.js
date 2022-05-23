const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs');
const users = require('./users');
const file = require("fs/promises");

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  waitForLeaders: true,
  brokers: ['kafka:9092']
});

const producer = kafka.producer()


app.get("/", async (req, res) => {
    res.send("api login");

    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: 'funciona el kafka' },
      ],
    })

});

app.post("/login", async(req,res) =>{
  //res.send("true or false")
  const user = req.body.user;
  const pass = req.body.pass;
  var user_blocked = await file.readFile("/blocked.json", "utf-8");
  user_blocked = JSON.parse(user_blocked);

  if(user_blocked.find((user_blocked) => user_blocked == user)){
    res.send(`usuario ${user} esta bloqueado`);
  }

  var userbd = users.find((x)=> x.user == user);
  const passbd = userbd?.pass;
  userbd = userbd?.user;
  var auth = false;

  if(userbd == user && passbd == pass){
    auth = true;
    res.send(`usuario: ${user} logueado correctamente`);
  }else{
    res.send(`usuario incorrecto`);
  }

  await producer.send({
    topic: "test-topic",
    messages: [
      {
        value: JSON.stringify({
          user,
          value: auth,
        }),
      },
    ],
  });
  
});

app.listen(port, async() => {
  console.log(`API RUN AT http://localhost:${port}`);
  await producer.connect()

});
