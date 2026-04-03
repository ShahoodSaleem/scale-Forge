"use server";

import { Resend } from 'resend';

// NOTE: You must add RESEND_API_KEY to your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { error: 'Name, email, and message are required.' };
  }

  try {
    const data = await resend.emails.send({
      from: 'Scale Forge Contact <onboarding@resend.dev>',
      to: 'scaleforge.sales@gmail.com', // TODO: Replace with your actual email
      subject: `New Message from ${name} via Scale Forge`,
      replyTo: email,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || 'Not provided'}
        
        Message:
        ${message}
      `,
    });

    if (data.error) {
      return { error: data.error.message };
    }

    return { success: 'Message sent successfully!' };
  } catch (error: any) {
    return { error: error.message || 'Something went default.' };
  }
}
