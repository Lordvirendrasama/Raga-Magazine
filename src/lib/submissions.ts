// src/lib/submissions.ts
import { firestore } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function createSubmission(data: any) {
  // Create submission document in Firestore
  const submissionPayload = {
    ...data,
    submittedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(firestore, 'musicSubmissions'), submissionPayload);
  
  return { id: docRef.id, ...submissionPayload };
}
