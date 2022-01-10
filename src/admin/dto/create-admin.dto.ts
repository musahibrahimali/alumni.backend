export class CreateAdminDto{
    username: string;
    password: string;
    email?: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    salt?: string;
    phone: string;
    address?: string;
    city?: string;
    previousImages?: string[];
    image?: string;
    roles: string[];
    isAdmin: boolean;
}