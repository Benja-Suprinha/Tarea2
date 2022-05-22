const express = require("express");
const cors = require("cors");
const { Kafka } = require('kafkajs')

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const kafka = new Kafka({
  brokers: ['kafka:9092']
});

const producer = kafka.producer()


app.get("/", async (req, res) => {
    res.send("api login");

    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: 'Hello KafkaJS user!' },
      ],
    })

});

app.post("/login", async(req,res) =>{
  res.send("true or false")
});

app.listen(port, async() => {
  console.log(`API RUN AT http://localhost:${port}`);
  await producer.connect()

});
