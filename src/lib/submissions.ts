// src/lib/submissions.ts
import { firestore } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function createSubmission(data: any) {
  // This function is no longer used by the form but is kept to prevent breaking the admin page.
  // The form now uses a mailto link.
  console.log("createSubmission is no longer the primary submission method.");
  return Promise.resolve();
}
