export class CreateBlogDto{
    blogTitle: string;
    blogDescription: string;
    blogSnippet: string; 
    blogCategory: string;
    blogDate?: string; 
    images?: string[]; 
    videos?: string[]; 
    comments?: string[]; 
}