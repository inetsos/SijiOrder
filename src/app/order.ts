export interface Order {
    _id?: string;
    storename: string;  // 가맹점
    shopname: string;  // 가맹점 상호
    username: string;   // 회원
    phoneno: string;    // 비회원 전화번호
    password: string;   // 비회원 비밀번호
<<<<<<< HEAD
    roadAddr: string;   // 도로명 주소
    jibunAddr: string;  // 지번 주소
    detailAddr: string; // 상세주소
=======
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
    type: number;       // 0:회원, 1: 비회원 주문
    tableNo: number;
    orderNo: number;
    status: string;
    createdAt?: Date;
    orderedAt?: Date;
    confirmedAt?: Date;
    ordermenu: OrderMenu[];
}

export interface OrderMenu {
    orderNo: number;
    menuNo: number;
    classify: string;
    name: string;
    price: number;
    number: number;
    sum: number;
}
