
'use server';

import 'dotenv/config';
import { z } from 'zod';
import { Resend } from 'resend';

const submitMusicSchema = z.object({
    name: z.string(),
    genre: z.string(),
    streamingLink: z.string().url(),
    bio: z.string(),
    instagram: z.string().optional(),
    email: z.string().email(),
});

export async function submitMusic(formData: unknown) {
  const parsed = submitMusicSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, message: 'Invalid form data.' };
  }

  const { name, genre, streamingLink, bio, instagram, email } = parsed.data;

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('RESEND_API_KEY is not defined in the environment variables.');
    return { success: false, message: 'Could not send email. The RESEND_API_KEY is missing or invalid. Please check your .env file.' };
  }

  try {
    const resend = new Resend(resendApiKey);

    const { data, error } = await resend.emails.send({
      from: 'RagaMagazine Submissions <onboarding@resend.dev>',
      to: ['theragamagazine@gmail.com'],
      subject: `New Music Submission: ${name}`,
      html: `
        <h1>New Music Submission</h1>
        <p><strong>Artist/Project Name:</strong> ${name}</p>
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Streaming Link:</strong> <a href="${streamingLink}">${streamingLink}</a></p>
        <p><strong>Bio:</strong></p>
        <p>${bio}</p>
        <p><strong>Instagram:</strong> ${instagram || 'Not provided'}</p>
        <p><strong>Contact Email:</strong> ${email}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: `Failed to send email: ${error.message}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Submission error:', error);
    if (error instanceof Error) {
        return { success: false, message: `An unexpected error occurred: ${error.message}` };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
