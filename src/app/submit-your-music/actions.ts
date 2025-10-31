
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

  try {
    // Initialize Resend with the API key here to ensure it's loaded.
    const resend = new Resend(process.env.RESEND_API_KEY);

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
      return { success: false, message: 'Failed to send email.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Submission error:', error);
    // Check if the error is due to a missing API key and provide a specific message.
    if (error instanceof Error && error.message.includes("Missing API key")) {
        return { success: false, message: 'Could not send email. The RESEND_API_KEY is missing or invalid. Please check your .env file.' };
    }
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
