// 대한민국 응급실 더미 데이터베이스
const hospitalDatabase = [
    { id: 1, name: '서울대학교병원', address: '서울특별시 종로구 대학로 101', phone: '02-2072-2114', distance: '2.3km', type: '종합병원' },
    { id: 2, name: '세브란스병원', address: '서울특별시 서대문구 연세로 50-1', phone: '02-2228-5800', distance: '3.5km', type: '종합병원' },
    { id: 3, name: '삼성서울병원', address: '서울특별시 강남구 일원로 81', phone: '02-3410-2114', distance: '5.2km', type: '종합병원' },
    { id: 4, name: '아산병원', address: '서울특별시 송파구 올림픽로43길 88', phone: '02-3010-3114', distance: '4.1km', type: '종합병원' },
    { id: 5, name: '가톨릭의대 서울성모병원', address: '서울특별시 서초구 반포대로 222', phone: '02-2258-5800', distance: '6.8km', type: '종합병원' },
    { id: 6, name: '부산대학교병원', address: '부산광역시 남구 용소로 179', phone: '051-240-7000', distance: '1.8km', type: '종합병원' },
    { id: 7, name: '인하대학교병원', address: '인천광역시 중구 인항로 27', phone: '032-890-2114', distance: '2.5km', type: '종합병원' },
    { id: 8, name: '대구가톨릭대학교병원', address: '대구광역시 남구 두류공원로 17', phone: '053-650-4000', distance: '3.2km', type: '종합병원' },
    { id: 9, name: '전남대학교병원', address: '광주광역시 동구 제봉로 42', phone: '062-220-5000', distance: '2.9km', type: '종합병원' },
    { id: 10, name: '충남대학교병원', address: '대전광역시 중구 대전로 640', phone: '042-280-7114', distance: '4.3km', type: '종합병원' },
    { id: 11, name: '강릉아산병원', address: '강원도 강릉시 해안로 38', phone: '033-610-5000', distance: '1.5km', type: '종합병원' },
    { id: 12, name: '원주세브란스기독병원', address: '강원도 원주시 일산동 162', phone: '033-741-5000', distance: '2.7km', type: '종합병원' },
    { id: 13, name: '춘천성심병원', address: '강원도 춘천시 중앙로 156', phone: '033-240-5000', distance: '3.1km', type: '종합병원' },
    { id: 14, name: '제주대학교병원', address: '제주특별자치도 제주시 아라일동 1753-3', phone: '064-717-1114', distance: '2.4km', type: '종합병원' },
    { id: 15, name: '울산대학교병원', address: '울산광역시 남구 삼산로 290', phone: '052-250-7000', distance: '3.6km', type: '종합병원' },
    { id: 16, name: '경북대학교병원', address: '대구광역시 중구 동덕로 130', phone: '053-200-2114', distance: '2.8km', type: '종합병원' },
    { id: 17, name: '전북대학교병원', address: '전라북도 전주시 덕진구 건지로 20', phone: '063-250-1114', distance: '4.2km', type: '종합병원' },
    { id: 18, name: '순천향대학교병원', address: '서울특별시 용산구 대사관로 59', phone: '02-709-9114', distance: '5.5km', type: '종합병원' },
    { id: 19, name: '한양대학교병원', address: '서울특별시 성동구 왕십리로 222-1', phone: '02-2290-8114', distance: '3.9km', type: '종합병원' },
    { id: 20, name: '고려대학교안암병원', address: '서울특별시 성북구 고려대로 73', phone: '02-920-5114', distance: '4.7km', type: '종합병원' },
    { id: 21, name: '분당서울대학교병원', address: '경기도 성남시 분당구 구미로 173번길 82', phone: '031-787-7000', distance: '7.2km', type: '종합병원' },
    { id: 22, name: '이화여자대학교의과대학부속목동병원', address: '서울특별시 양천구 안양천로 1071', phone: '02-2650-5114', distance: '6.1km', type: '종합병원' },
    { id: 23, name: '경희대학교병원', address: '서울특별시 동대문구 경희대로 23', phone: '02-958-8114', distance: '5.8km', type: '종합병원' },
    { id: 24, name: '중앙대학교병원', address: '서울특별시 동작구 흑석로 102', phone: '02-6299-1114', distance: '4.9km', type: '종합병원' },
    { id: 25, name: '국립중앙의료원', address: '서울특별시 중구 을지로 245', phone: '02-2260-7114', distance: '3.4km', type: '종합병원' },
    { id: 26, name: '서울아산병원', address: '서울특별시 송파구 올림픽로43길 88', phone: '02-3010-3114', distance: '4.1km', type: '종합병원' },
    { id: 27, name: '서울특별시보라매병원', address: '서울특별시 동작구 신대방2동 321', phone: '02-870-2114', distance: '5.3km', type: '종합병원' },
    { id: 28, name: '부산광역시의료원', address: '부산광역시 중구 중앙대로 26', phone: '051-600-6114', distance: '2.1km', type: '종합병원' },
    { id: 29, name: '인천광역시의료원', address: '인천광역시 미추홀구 경인로 697', phone: '032-890-2114', distance: '2.6km', type: '종합병원' },
    { id: 30, name: '대전선병원', address: '대전광역시 서구 둔산로 100', phone: '042-611-3000', distance: '3.8km', type: '종합병원' }
];

// 병원 검색 함수
function searchHospitals(query) {
    if (!query || query.trim() === '') {
        return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    const results = hospitalDatabase.filter(hospital => {
        return hospital.name.toLowerCase().includes(searchTerm) ||
               hospital.address.toLowerCase().includes(searchTerm) ||
               hospital.type.toLowerCase().includes(searchTerm);
    });
    
    // 거리순으로 정렬 (더미 데이터이므로 랜덤하게 정렬)
    return results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 5);
}

// 전역으로 export
if (typeof window !== 'undefined') {
    window.hospitalDatabase = hospitalDatabase;
    window.searchHospitals = searchHospitals;
}

