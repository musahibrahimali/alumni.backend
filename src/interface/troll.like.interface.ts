interface ITrollLike {
    _id?: string;
    troll: string;
    user: string;
    createAt?: Date;
    updatedAt?: Date;
}

export default ITrollLike;