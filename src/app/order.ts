export interface Order {
    _id?: string;
    storename: string;  // 가맹점
    shopname: string;  // 가맹점 상호
    username: string;   // 회원
    phoneno: string;    // 비회원 전화번호
    password: string;   // 비회원 비밀번호
    type: number;       // 0:회원, 1: 비회원 주문
    tableNo: number;
    orderNo: number;
    status: string;
    createdAt?: Date;
    orderedAt?: Date;
    confirmedAt?: Date;
    ordermenu: string[];
}
