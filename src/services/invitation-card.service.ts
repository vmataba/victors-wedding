import {
    deleteFromFirebase,
    FirebaseNode,
    postToFirebase,
    readCollectionFromFirebase,
    readFromFirebase,
    updateInFirebase
} from "../config/firebase.config";
import {InvitationCard} from "../models/invitation-card.mode";

export const loadInvitationCards = async (): Promise<InvitationCard[]> => {
    return await readCollectionFromFirebase<InvitationCard>(FirebaseNode.INVITATION_CARD);
}

export const createInvitationCard = async (invitationCard: InvitationCard): Promise<string> => {
    return await postToFirebase(FirebaseNode.INVITATION_CARD, invitationCard);

}

export const updateInvitationCard = async (invitationCard: InvitationCard) => {
    return await updateInFirebase(FirebaseNode.INVITATION_CARD, invitationCard.id, invitationCard);
}

export const viewInvitationCard = async (id: string): Promise<InvitationCard | null> => {
    return await readFromFirebase(FirebaseNode.INVITATION_CARD, id);
}

export const removeInvitationCard = async (id: string) => {
    return await deleteFromFirebase(FirebaseNode.INVITATION_CARD, id);
}