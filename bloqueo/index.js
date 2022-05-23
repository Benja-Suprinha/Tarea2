const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs');
const file = require("fs/promises");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'test-group' })

app.get("/", async (req, res) => {
    res.send("baneados");
});

app.get("/blocked", async (req, res) =>{
  var user_blocked = await file.readFile("/blocked.json", "utf-8");
  user_blocked = JSON.parse(user_blocked);
  res.send("users-blocked: " + user_blocked);
})

const fail = {};

app.listen(port, async() => {
  console.log(`API RUN AT http://localhost:${port}`);

  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const valor = JSON.parse(message.value.toString());
      //console.log(valor);
      const { user , value } = valor;
      console.log(user);
      console.log(value);
      const {timestamp} = message;
      if(value == false){
        //console.log([Number(timestamp)]);
        if(!fail[user]){
          fail[user] = [Number(timestamp)];
          //console.log(fail)
        }else{
          fail[user].push([Number(timestamp)]);
          if(fail[user].length >= 5){
            console.log(fail);
            if(fail[user][fail[user].length-1] - fail[user][0] <= 60000){
              var user_blocked = await file.readFile("/blocked.json", "utf-8");
              user_blocked = JSON.parse(user_blocked);
              user_blocked.push(user);
              await file.writeFile("/blocked.json", JSON.stringify(user_blocked));
              console.log(`se agrego el usuario ${user} a los usuarios bloqueados`)
            }
          }
        }
      }
    },
  })

});