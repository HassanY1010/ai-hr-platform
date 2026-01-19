// @ts-ignore
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { QuestionAnswer } from '../modules/daily-question/types';

interface EmployeeDB extends DBSchema {
    pending_answers: {
        key: number;
        value: QuestionAnswer & { id?: string };
    };
}

class OfflineService {
    private dbPromise: Promise<IDBPDatabase<EmployeeDB>>;

    constructor() {
        this.dbPromise = openDB<EmployeeDB>('employee-db', 1, {
            upgrade(db: any) {
                db.createObjectStore('pending_answers', { keyPath: 'id', autoIncrement: true });
            },
        });
    }

    async saveAnswer(answer: QuestionAnswer) {
        const db = await this.dbPromise;
        await db.add('pending_answers', answer);
    }

    async getPendingAnswers() {
        const db = await this.dbPromise;
        return db.getAll('pending_answers');
    }

    async clearAllAnswers() {
        const db = await this.dbPromise;
        await db.clear('pending_answers');
    }

    async deleteAnswer(key: number) {
        const db = await this.dbPromise;
        await db.delete('pending_answers', key);
    }
}

export const offlineService = new OfflineService();
