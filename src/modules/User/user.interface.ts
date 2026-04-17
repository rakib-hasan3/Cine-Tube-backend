export interface IUser {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
    status: 'active' | 'blocked'; // এই লাইনটি
    avatar?: string;
    createdAt: string;
}