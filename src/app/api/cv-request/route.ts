import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { NextResponse } from 'next/server';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

const senderEmail = process.env.MAILERSEND_SENDER_EMAIL || '';
const senderName = process.env.MAILERSEND_SENDER_NAME || 'CV Request';
const recipientEmail = process.env.MAILERSEND_RECIPIENT_EMAIL || '';

async function validateTurnstileToken(token: string, remoteip?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY no está configurada');
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Error validando token de Turnstile:', error);
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { name, email, organization, role, reason, turnstileToken } = body;

    // Validación básica
    if (!name || !email || !reason) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 },
      );
    }

    // Validar token de Turnstile
    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Token de verificación faltante' },
        { status: 400 },
      );
    }

    // Obtener IP del cliente
    const remoteip =
      request.headers.get('CF-Connecting-IP') ||
      request.headers.get('X-Forwarded-For')?.split(',')[0] ||
      request.headers.get('X-Real-IP') ||
      undefined;

    const isValidToken = await validateTurnstileToken(turnstileToken, remoteip);

    if (!isValidToken) {
      return NextResponse.json(
        { error: 'Verificación fallida. Por favor, intenta nuevamente.' },
        { status: 400 },
      );
    }

    // Validar que las variables de entorno estén configuradas
    if (!process.env.MAILERSEND_API_KEY || !senderEmail || !recipientEmail) {
      console.error('MailerSend configuration missing');
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 },
      );
    }

    const sentFrom = new Sender(senderEmail, senderName);
    const recipients = [new Recipient(recipientEmail, 'CV Request Recipient')];

    // Mapeo de motivos en español e inglés
    const reasonMap: Record<string, { es: string; en: string }> = {
      reclutamiento: { es: 'Reclutamiento', en: 'Recruitment' },
      networking: { es: 'Networking', en: 'Networking' },
      'colaboracion-academica': {
        es: 'Colaboración académica',
        en: 'Academic collaboration',
      },
      'consulta-profesional': {
        es: 'Consulta profesional',
        en: 'Professional inquiry',
      },
      otro: { es: 'Otro', en: 'Other' },
    };

    const reasonText = reasonMap[reason] || { es: reason, en: reason };

    // Crear el contenido del email
    const emailSubject = `Solicitud de CV - ${name}`;
    const emailHtml = `
      <h2>Solicitud de CV</h2>
      <p>Has recibido una nueva solicitud de CV:</p>
      <ul>
        <li><strong>Nombre:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Organización/Empresa:</strong> ${organization || 'No especificada'}</li>
        <li><strong>Cargo/Rol:</strong> ${role || 'No especificado'}</li>
        <li><strong>Motivo de interés:</strong> ${reasonText.es} (${reasonText.en})</li>
      </ul>
      <p>Puedes responder directamente a este correo para contactar a ${name}.</p>
    `;

    const emailText = `
Solicitud de CV

Has recibido una nueva solicitud de CV:

Nombre: ${name}
Email: ${email}
Organización/Empresa: ${organization || 'No especificada'}
Cargo/Rol: ${role || 'No especificado'}
Motivo de interés: ${reasonText.es} (${reasonText.en})

Puedes responder directamente a este correo para contactar a ${name}.
    `;

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(new Sender(email, name))
      .setSubject(emailSubject)
      .setHtml(emailHtml)
      .setText(emailText);

    await mailerSend.email.send(emailParams);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error al enviar el email' },
      { status: 500 },
    );
  }
}

