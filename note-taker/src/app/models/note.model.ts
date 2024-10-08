export interface Note {
    id: number;
    title: string;
    content: string;
    createdAt?: Date;
    priority: 'LOW';
    category: string[]
}

export const Priority = [
    'LOW',
    'MEDIUM',
    'HIGH',
    'VERY_HIGH',
    'CRITICAL'
]