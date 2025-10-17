import {
    deleteFromFirebase,
    FirebaseNode,
    postToFirebase,
    readCollectionFromFirebase,
    readFromFirebase,
    updateInFirebase
} from "../config/firebase.config";
import { Expense } from "../models/expense.model";

export const loadExpenses = async (): Promise<Expense[]> => {
    return await readCollectionFromFirebase<Expense>(FirebaseNode.EXPENSES);
}

export const createExpense = async (expense: Expense): Promise<string> => {
    return await postToFirebase(FirebaseNode.EXPENSES, expense);

}

export const updateExpense = async (expense: Expense) => {
    return await updateInFirebase(FirebaseNode.EXPENSES, expense.id, expense);
}

export const viewExpense = async (id: string): Promise<Expense | null> => {
    return await readFromFirebase(FirebaseNode.EXPENSES, id);
}

export const removeExpense = async (id: string) => {
    return await deleteFromFirebase(FirebaseNode.EXPENSES, id);
}