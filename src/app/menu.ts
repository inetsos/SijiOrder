export interface Menu {
    _id: string;
    menuNo: number;
    classify: string;
    name: string;
    price: number;
    description: string;
    username: string;
    premium: Premium[];
}

export interface Premium {
    size: string;
    price: number;
}
