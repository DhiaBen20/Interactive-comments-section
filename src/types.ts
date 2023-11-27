export type User = {
    username: string;
    image: {
        png: string;
        webp: string;
    };
};
export type Vote = {
    type: "upvote" | "downvote";
    username: string;
};

export type Comment = {
    id: string;
    content: string;
    createdAt: number;
    score: number;
    user: User;
    replies: Reply[];
    votes?: Vote[];
};
export type Reply = Comment & {
    replyingTo: string;
};
