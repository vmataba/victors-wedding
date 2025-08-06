import {Invitee} from "./invitee.model";

export interface InviteeReport {
    invitees: Invitee[];
    totalPledgedAmount: number;
    totalPaidAmount: number;
}