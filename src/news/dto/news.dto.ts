export class CreateNewsDto{
    newsTitle: string;
    newsSnippet: string;
    newsDescription: string;
    images?: string[];
    videos?: string[];
}