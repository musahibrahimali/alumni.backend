export class CreateCLientDto{
    socialId?: string;
    username: string;
    email?: string;
    password?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    salt?: string;
    previousImages?: string[];
    roles: string[];
    isAdmin: boolean;
}