export interface TrainingSession {
    id: string;
    title: string;
    attendees: number;
    status: 'upcoming' | 'ongoing' | 'completed';
}
