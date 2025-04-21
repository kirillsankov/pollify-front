export interface User {username: string; password: string};

export interface Poll {
    _id: string;
    title: string;
    authorId: string;
    authorName: string;
    questions: Question[];
    createAt: string;
    votedUsers: string;
  }
  
  export interface Question {
    text: string;
    options: string[];
    votes: Record<string, number>;
    votedUsers: string[];
  }