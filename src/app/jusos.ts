export interface Jusos {
    results: {
        common: Common,
        juso: Juso[];
    };
}

export interface Common {
    totalCount:  string;    // Y 총 검색 데이터수
    currentPage:  number;   // Y 페이지 번호
    countPerPage:  number;  // Y 페이지당 출력할 결과 Row수
    errorCode:  string;     // Y 에러 코드
    errorMessage: string;   // Y 에러 메시지
}

export interface Juso {
    roadAddr: string;       // Y 전체 도로명주소
    roadAddrPart1: string;  // Y 도로명주소(참고항목 제외)
    roadAddrPart2: string;  // N 도로명주소 참고항목
    jibunAddr: string;      // Y 지번 정보
    engAddr: string;        // Y 도로명주소(영문)
    zipNo: string;          // Y 우편번호
    admCd: string;          // Y 행정구역코드
    rnMgtSn: string;        // Y 도로명코드
    bdMgtSn: string;        // Y 건물관리번호
    detBdNmList: string;    // N 상세건물명
    bdNm: string;           // N 건물명
    bdKdcd: string;         // Y 공동주택여부 (1:공동주택, 0: 비공동주택)
    siNm: string;           // Y 시도명
    sggNm: string;          // N 시군구명
    emdNm: string;          // Y 읍면동명
    liNm: string;           // N 법정리명
    Rn: string;             // Y 도로명
    udrtYn: string;         // Y 지하여부 (0:지상, 1:지하)
    buldMnnm: number;       // Y 건물본번
    buldSlno: number;       // Y 건물부번 (부번이 없는 경우 0)
    mtYn: string;           // Y 산여부 (0:대지, 1:산)
    lnbrMnnm: number;       // Y 지번본번(번지)
    lnbrSlno: number;       // Y 지번부번(호) (부번이 없는 경우 0)
    emdNo: string;          // Y 읍면동일련번호
}

export interface Address {
    roadAddr: string;       // Y 전체 도로명주소
    jibunAddr: string;      // Y 지번 정보
}
