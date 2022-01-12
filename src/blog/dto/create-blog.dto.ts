export class CreateBlogDto{
    title: string;
    details: string;
    snippet: string; 
    category: string;
    date?: Date; 
    images?: string[]; 
    videos?: string[]; 
    comments?: string[]; 
}