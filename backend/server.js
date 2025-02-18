import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("Resend API Key:", process.env.RESEND_API_KEY);

app.post("/send-email", async (req, res) => {
  const { name, firstname, email, message } = req.body;

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hello World",
      html: `
        <h>Nouveau message reçu</h>
        <p><strong>Nom :</strong> ${name} ${firstname}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong> ${message}</p>
      `,
    });

    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Erreur lors de l’envoi du mail:", error);
    res.status(500).json({ error: "Erreur lors de l’envoi du mail" });
  }
});

app.listen(port, () => {
  console.log(`Serveur backend démarré sur http://localhost:${port}`);
});
