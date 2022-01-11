export class CreateCLientDto{
    socialId?: string;
    username: string;
    password?: string;
    displayName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    salt?: string;
    image?: string;
    roles?: string[];
    isAdmin?: boolean;
}