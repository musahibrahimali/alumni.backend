interface ITrollComment {
    _id?: string;
    troll: string;
    user: string;
    comment?: string;
    images?: string[];
    videos?: string[];
    createAt?: Date;
    updatedAt?: Date;
}

export default ITrollComment;
