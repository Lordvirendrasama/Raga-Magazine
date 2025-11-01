
'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const submitMusicSchema = z.object({
    name: z.string().min(2),
    genre: z.string(),
    streamingLink: z.string().url(),
    bio: z.string().min(10),
    instagram: z.string().optional(),
    email: z.string().email(),
});

export async function submitMusic(formData: unknown) {
  const parsed = submitMusicSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, message: 'Invalid form data.' };
  }
  
  if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key is not set.');
      return { success: false, message: 'Server configuration error: Missing API key.' };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, genre, streamingLink, bio, instagram, email } = parsed.data;

  try {
    const { data, error } = await resend.emails.send({
        from: 'Raga Submissions <submissions@studioprototyper.com>',
        to: ['theragamagazine@gmail.com'],
        subject: `New Music Submission: ${name}`,
        reply_to: email,
        html: `
            <h1>New Music Submission</h1>
            <p><strong>Artist/Project Name:</strong> ${name}</p>
            <p><strong>Genre:</strong> ${genre}</p>
            <p><strong>Contact Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Streaming Link:</strong> <a href="${streamingLink}">${streamingLink}</a></p>
            <p><strong>Instagram:</strong> ${instagram || 'N/A'}</p>
            <hr>
            <h2>Bio</h2>
            <p>${bio.replace(/\n/g, '<br>')}</p>
        `,
    });

    if (error) {
        console.error('Resend error:', error);
        return { success: false, message: 'Failed to send email submission.' };
    }

    return { success: true };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
