export interface Invitee {
    id: string;
    name: string;
    phone: string;
    pledgeAmount?: number
    paymentInstallments?: number[]
    paidAmount?: number
    registrationType?: RegistrationType
    adminId?: string
}

export enum RegistrationType {
    SELF = "SELF",
    REGISTERED = "REGISTERED",
}