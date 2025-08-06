import {
    deleteFromFirebase,
    FirebaseNode,
    postToFirebase,
    readCollectionFromFirebase,
    readFromFirebase,
    updateInFirebase
} from "../config/firebase.config";
import {Invitee} from "../models/invitee.model";

export const loadInvitees = async () => {
    return await readCollectionFromFirebase<Invitee>(FirebaseNode.INVITEES);
}

export const registerInvitee = async (invitee: Invitee): Promise<string> => {
    return await postToFirebase(FirebaseNode.INVITEES, invitee);

}

export const updateInvitee = async (invitee: Invitee) => {
    return await updateInFirebase(FirebaseNode.INVITEES, invitee.id, invitee);
}

export const viewInvitee = async (id: string): Promise<Invitee | null> => {
    return await readFromFirebase(FirebaseNode.INVITEES, id);
}

export const removeInvitee = async (id: string) => {
    return await deleteFromFirebase(FirebaseNode.INVITEES, id);
}