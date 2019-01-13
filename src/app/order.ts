export interface Order {
    _id?: string;
    storename: string;  // 가맹점
    shopname: string;  // 가맹점 상호
    username: string;   // 회원
    tableNo: number;
    orderNo: number;
    status: string;
    createdAt?: Date;
    orderedAt?: Date;
    confirmedAt?: Date;
    ordermenu: string[];
}
