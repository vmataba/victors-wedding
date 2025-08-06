import {initializeApp} from "firebase/app";
import {
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCHwARW9VbAu9SnRQWwjMjmmQyqNbUL2dw",
    authDomain: "victor-wedding-2913a.firebaseapp.com",
    projectId: "victor-wedding-2913a",
    storageBucket: "victor-wedding-2913a.firebasestorage.app",
    messagingSenderId: "794246422282",
    appId: "1:794246422282:web:e49c8c0eb0c502bb6da4f3",
    measurementId: "G-V3PLR1VQJ9"
};

export enum FirebaseNode {
    INVITATION_CARD = "invitation-cardS",
    INVITEES = "invitees",
    ADMINS = "admins"
}

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseDb = getFirestore(firebaseApp);

export const postToFirebase = async (node: FirebaseNode, data: any): Promise<string> => {
    data = {
        ...data,
        id: new Date().getTime().toString()
    }
    try {
        const docRef = doc(firebaseDb, node, data.id);
        await setDoc(docRef, data);
        return docRef.id;
    } catch (error) {
        console.error(`Error adding document to ${node}:`, error);
        throw error;
    }
}

export const readFromFirebase = async <T = DocumentData>(node: FirebaseNode, path?: string): Promise<T | null> => {
    try {
        const docRef = path  !== undefined ? doc(firebaseDb, node, path) : doc(firebaseDb, node);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as T;
        } else {
            console.log(`No document found at ${node}/${path}`);
            return null;
        }
    } catch (error) {
        console.error(`Error reading document from ${node}/${path}:`, error);
        throw error;
    }
}

export const deleteFromFirebase = async (node: FirebaseNode, path: string): Promise<boolean> => {
    try {
        const docRef = doc(firebaseDb, node, path);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error(`Error deleting document from ${node}/${path}:`, error);
        throw error;
    }
}

export const updateInFirebase = async (node: FirebaseNode, path: string, data: Partial<any>): Promise<boolean> => {
    try {
        const docRef = doc(firebaseDb, node, path);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        console.log('Node : ', node);
        console.log('Path : ', path);
        console.error(`Error updating document at ${node}/${path}:`, error);
        throw error;
    }
}

export const readCollectionFromFirebase = async <T>(node: FirebaseNode): Promise<T[]> => {
    try {
        const collectionRef = collection(firebaseDb, node);
        const querySnapshot = await getDocs(collectionRef);
        const documents: T[] = [];
        querySnapshot.forEach((doc) => {
            documents.push({id: doc.id, ...doc.data()} as T);
        });

        return documents;
    } catch (error) {
        console.error(`Error reading collection from ${node}:`, error);
        throw error;
    }
}
