export class CreateNewsDto{
    title: string;
    snippet: string;
    details: string;
    images?: string[];
    videos?: string[];
}