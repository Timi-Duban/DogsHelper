import { DocumentData, DocumentSnapshot, QueryDocumentSnapshot } from "firebase/firestore";

export const getTodayDate = () => {
    var date = new Date();
    date.setUTCHours(12, 0, 0, 0);
    return date;
};

export const getXDaysAgo = (x: number) => {
    var date = getTodayDate();
    date.setDate(date.getDate() - x);
    return date;
}

export type DocType = { id: string, data: DocumentData | undefined }

type QuerySnapchotArray = QueryDocumentSnapshot<DocumentData, DocumentData>[]
export const extractArrayFromQuerySnapchot = (snap: QuerySnapchotArray): DocType[] => {
    return snap.map((doc) => {
        return { id: doc.id, data: doc.data() };
    });
};

type QuerySnapchotDoc = DocumentSnapshot<DocumentData, DocumentData>
export const extractDocFromQuerySnapchot = (snap: QuerySnapchotDoc): DocType => {
    return { id: snap.id, data: snap.data() };
};
