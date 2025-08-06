import {
    deleteFromFirebase,
    FirebaseNode,
    postToFirebase,
    readFromFirebase,
    updateInFirebase
} from "../config/firebase.config";
import {Admin} from "../models/admin.model";
import {defaultAdmin} from "../config/admin.confi";

export const loadAdmins = async () => {
    return await readFromFirebase<Admin[]>(FirebaseNode.ADMINS);
}

export const registerAdmin = async (admin: Admin) => {
    return await postToFirebase(FirebaseNode.ADMINS, admin);
}


export const viewAdmin = async (id: string): Promise<Admin | null> => {
    return await readFromFirebase(FirebaseNode.ADMINS, id);
}

export const updateAdmin = async (admin: Admin) => {
    return await updateInFirebase(FirebaseNode.ADMINS, admin.id, admin);
}

export const removeAdmin = async (id: string) => {
    return await deleteFromFirebase(FirebaseNode.ADMINS, id);
}

export const loginAdmin = async (username: string, password: string) => {
    if (defaultAdmin.email === username && defaultAdmin.password === password) {
        return Promise.resolve(defaultAdmin);
    }
    const admins = await loadAdmins();
    const admin = admins?.find(a => a.email === username && a.password === password);
    return Promise.resolve(admin);

}