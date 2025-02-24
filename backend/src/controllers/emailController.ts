import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (req, res) => {
  const { name, firstname, email, message } = req.body;

  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Hello World',
      html: `
        <h1>Nouveau message reçu</h1>
        <p><strong>Nom :</strong> ${name} ${firstname}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong> ${message}</p>
      `,
    });

    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Erreur lors de l’envoi du mail:', error);
    res.status(500).json({ error: 'Erreur lors de l’envoi du mail' });
  }
};
