const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs')

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
    res.send("usuarios bloqueados");
})

app.listen(port, async() => {
  console.log(`API RUN AT http://localhost:${port}`);

  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  })

});