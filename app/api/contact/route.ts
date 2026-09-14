import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Envoi de l'email : d'Espace Dakinis à Alexandra
    await transporter.sendMail({
      from: '"Espace Dakinis" <' + process.env.GMAIL_USER + '>',
      to: process.env.GMAIL_USER, 
      replyTo: email, // Si elle clique sur "Répondre", ça ira au patient
      subject: `Nouveau message de ${name} (Espace Dakinis)`,
      html: `
        <h1>Nouveau message depuis le site Espace Dakinis</h1>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
        <p><strong>Email :</strong> ${email}</p>
        <br>
        <p><strong>Message :</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Erreur d'envoi d'email:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}