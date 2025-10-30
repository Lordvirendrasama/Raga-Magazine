'use server';

// This function is now a Server Action.
// It receives data from the form and is responsible for processing it on the server.

export async function handleMusicSubmission(data: any) {
  try {
    const recipient = 'theragamagazine@gmail.com';
    const subject = `Music Submission: ${data.artistName}`;
    const body = `
        A new music submission has been received:
        -----------------------------------------
        Artist Name: ${data.artistName}
        Genre: ${data.genre}
        Streaming Link: ${data.streamingLink}
        Contact Email: ${data.contactEmail}
        Instagram: ${data.instagramHandle || 'N/A'}
        
        Bio:
        ${data.bio}
        -----------------------------------------
      `;

    // --- Developer Note ---
    // The code below logs the submission to the server console.
    // To send an actual email, you need to integrate an email service provider.
    // Popular choices for Next.js include:
    // - Resend (resend.com)
    // - Nodemailer (with an SMTP service like Gmail or SendGrid)
    //
    // Example using a hypothetical email service:
    //
    // import { sendEmail } from '@/lib/email'; // A service you would create
    // await sendEmail({
    //   to: recipient,
    //   subject: subject,
    //   text: body,
    // });
    //
    // For now, we will just log it to demonstrate that the data is being received.
    
    console.log('---- New Music Submission ----');
    console.log(`Intended Recipient: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log('Body:');
    console.log(body);
    console.log('----------------------------');
    console.log('Email sending is not implemented. The data above was logged to the server console.');
    
    // Simulate a successful operation.
    return { success: true };

  } catch (error) {
    console.error('Submission handling failed:', error);
    return { success: false, error: 'An error occurred on the server.' };
  }
}
