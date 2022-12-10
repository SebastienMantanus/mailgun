require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

// préparation du serveur
const app = express();
app.use(express.json());
app.use(cors());

// préparation de MailGun
const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: process.env.MAILGUN_USERNAME,
  key: process.env.MAILGUN_API_KEY,
});

// route génarale
app.post("/post", async (req, res) => {
  const messageData = {
    from: `${req.body.firstname} ${req.body.lastname} <${req.body.email}>`,
    to: "sebastien@mantanus.me",
    subject: req.body.subject,
    text: req.body.text,
  };

  console.log(messageData);
  try {
    // envoi du message !
    const response = await client.messages.create(
      process.env.SANDBOX,
      messageData
    );

    res.status(200).json("Message envoyé");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Démarrage du serveur
app.listen(process.env.PORT, () => {
  console.log(`Server is on fire on port ${process.env.PORT}`);
});
