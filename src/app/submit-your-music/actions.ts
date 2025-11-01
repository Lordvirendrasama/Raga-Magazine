
'use server';

import { z } from 'zod';
import { firestore } from '@/lib/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

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

  try {
    const submissionData = {
        ...parsed.data,
        submittedAt: FieldValue.serverTimestamp(),
        status: 'pending',
    };
    
    await firestore.collection('submissions').add(submissionData);

    return { success: true };
  } catch (error) {
    console.error('Submission error:', error);
    return { success: false, message: 'An unexpected error occurred while saving to the database.' };
  }
}

export async function getSubmissions() {
    try {
        const submissionsSnapshot = await firestore.collection('submissions').orderBy('submittedAt', 'desc').get();
        const submissions = submissionsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamp to a serializable format (ISO string)
                submittedAt: data.submittedAt.toDate().toISOString(),
            }
        });
        return { success: true, submissions };
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return { success: false, message: 'An unexpected error occurred while fetching submissions.' };
    }
}
