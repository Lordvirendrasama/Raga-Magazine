
import { db } from './firebase';
import { collection, doc, getDocs, writeBatch, query, orderBy } from 'firebase/firestore';

export interface MuseumWall {
    id: string;
    text: string;
    youtubeUrl: string;
}

const COLLECTION_NAME = 'museum_walls';

const defaultContent: Omit<MuseumWall, 'id'>[] = [
    {
        text: "Artist One is known for blending traditional sounds with modern electronic beats, redefining the genre in the early 2000s.",
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        text: "A master of the sitar, Artist Two is celebrated for their flawless technique and deep understanding of classical ragas.",
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        text: "Pioneering the use of microtonal keyboards, Artist Three opened new harmonic possibilities in contemporary music.",
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        text: "With an electrifying stage presence, Artist Four's live shows are legendary, captivating audiences worldwide.",
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    }
];

export async function getMuseumContent(): Promise<MuseumWall[]> {
    const wallsCollection = collection(db, COLLECTION_NAME);
    const q = query(wallsCollection, orderBy('id'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log('No museum content found, initializing with default data.');
        await initializeDefaultContent();
        // After initializing, fetch again to get the sorted data
        const newSnapshot = await getDocs(q);
         const walls: MuseumWall[] = [];
        newSnapshot.forEach((doc) => {
            const data = doc.data();
            walls.push({
                id: doc.id,
                ...data,
                youtubeUrl: data.youtubeUrl || "",
            } as MuseumWall);
        });
        return walls;
    }

    const walls: MuseumWall[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        walls.push({ 
            id: doc.id, 
            ...data,
            youtubeUrl: data.youtubeUrl || "",
        } as MuseumWall);
    });
    
    // Firestore query with orderBy should handle sorting, but as a fallback:
    walls.sort((a, b) => a.id.localeCompare(b.id));

    return walls;
}

export async function updateMuseumContent(walls: Omit<MuseumWall, 'id'>[]): Promise<void> {
    const batch = writeBatch(db);
    
    walls.forEach((wall, index) => {
        const wallId = `wall-${index + 1}`;
        const wallRef = doc(db, COLLECTION_NAME, wallId);
        batch.set(wallRef, wall);
    });

    await batch.commit();
}


async function initializeDefaultContent(): Promise<void> {
    const batch = writeBatch(db);
    defaultContent.forEach((content, index) => {
        const docId = `wall-${index + 1}`;
        const docRef = doc(db, COLLECTION_NAME, docId);
        batch.set(docRef, { ...content, id: docId });
    });
    await batch.commit();
}
