export interface Menu {
    _id: string;
    menuNo: number;
    classify: string;
    name: string;
    price: number;
    description: string;
    image: number;
    username: string;
    premia: Premium[];
}

export interface Premium {
    size: string;
    premium_price: number;
}
