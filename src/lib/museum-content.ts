
import { db } from './firebase';
import { collection, doc, getDocs, writeBatch, query, orderBy } from 'firebase/firestore';
import placeholderImages from '@/app/lib/placeholder-images.json';

export interface MuseumWall {
    id: string;
    artistName: string;
    artistDescription: string;
    imageUrl: string;
    imageHint: string;
    youtubeUrl: string;
}

const COLLECTION_NAME = 'museum_walls';

const defaultContent: Omit<MuseumWall, 'id'>[] = [
    {
        artistName: "Artist One - The Visionary",
        artistDescription: "Known for blending traditional sounds with modern electronic beats, Artist One redefined the genre in the early 2000s.",
        imageUrl: placeholderImages.images[10].url,
        imageHint: placeholderImages.images[10].hint,
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        artistName: "Artist Two - The Purist",
        artistDescription: "A master of the sitar, Artist Two is celebrated for their flawless technique and deep understanding of classical ragas.",
        imageUrl: placeholderImages.images[2].url,
        imageHint: placeholderImages.images[2].hint,
        youtubeUrl: "",
    },
    {
        artistName: "Artist Three - The Innovator",
        artistDescription: "Pioneering the use of microtonal keyboards, Artist Three opened new harmonic possibilities in contemporary music.",
        imageUrl: placeholderImages.images[13].url,
        imageHint: placeholderImages.images[13].hint,
        youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
        artistName: "Artist Four - The Performer",
        artistDescription: "With an electrifying stage presence, Artist Four's live shows are legendary, captivating audiences worldwide.",
        imageUrl: placeholderImages.images[14].url,
        imageHint: placeholderImages.images[14].hint,
        youtubeUrl: "",
    }
];

export async function getMuseumContent(): Promise<MuseumWall[]> {
    const wallsCollection = collection(db, COLLECTION_NAME);
    const q = query(wallsCollection, orderBy('id'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        console.log('No museum content found, initializing with default data.');
        await initializeDefaultContent();
        return defaultContent.map((wall, index) => ({
            ...wall,
            id: `wall-${index + 1}`
        }));
    }

    const walls: MuseumWall[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        walls.push({ 
            id: doc.id, 
            ...data,
            // Ensure youtubeUrl is present, default to empty string if not
            youtubeUrl: data.youtubeUrl || "",
        } as MuseumWall);
    });
    
    // Firestore query with orderBy should handle sorting, but as a fallback:
    walls.sort((a, b) => a.id.localeCompare(b.id));

    return walls;
}

export async function updateMuseumContent(walls: MuseumWall[]): Promise<void> {
    const batch = writeBatch(db);
    
    walls.forEach(wall => {
        const wallRef = doc(db, COLLECTION_NAME, wall.id);
        // We exclude the ID from the data we write to Firestore
        const { id, ...wallData } = wall;
        batch.set(wallRef, wallData);
    });

    await batch.commit();
}


async function initializeDefaultContent(): Promise<void> {
    const batch = writeBatch(db);
    defaultContent.forEach((content, index) => {
        const docRef = doc(db, COLLECTION_NAME, `wall-${index + 1}`);
        batch.set(docRef, { ...content, id: `wall-${index + 1}` });
    });
    await batch.commit();
}
