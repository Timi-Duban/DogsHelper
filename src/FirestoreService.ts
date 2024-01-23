import { QueryDocumentSnapshot, DocumentData, DocumentSnapshot } from "firebase/firestore";

export const getTodayDate = () => {
    var date = new Date();
    date.setUTCHours(12,0,0,0);
    return date;
};

type QuerySnapchotArg = DocumentSnapshot<DocumentData, DocumentData> 
    | QueryDocumentSnapshot<DocumentData, DocumentData>[]
export const extractDocsFromQuerySnapchot = (snap : QuerySnapchotArg) => {
    const arr = Array.isArray(snap) ? snap : [snap];
    return arr.map((doc) => {
        return { id: doc.id, data: doc.data() };
    });
};
