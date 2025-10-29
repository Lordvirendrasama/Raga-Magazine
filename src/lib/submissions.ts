// src/lib/submissions.ts
import { firestore, storage } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export async function createSubmission(data: any) {
  const { pressPhoto, ...submissionData } = data;

  if (!pressPhoto) {
    throw new Error('Press photo is required.');
  }

  // 1. Upload image to Firebase Storage
  const photoId = uuidv4();
  const fileExtension = pressPhoto.name.split('.').pop();
  const photoPath = `submissions/${photoId}.${fileExtension}`;
  const storageRef = ref(storage, photoPath);
  
  await uploadBytes(storageRef, pressPhoto);
  const photoUrl = await getDownloadURL(storageRef);

  // 2. Create submission document in Firestore
  const submissionPayload = {
    ...submissionData,
    photoUrl,
    submittedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(firestore, 'musicSubmissions'), submissionPayload);
  
  return { id: docRef.id, ...submissionPayload };
}
