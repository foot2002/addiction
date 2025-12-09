// 챗봇 질문 순서와 DB 구조
// 순서: 1. 노출물질 > 2. 세부물질 > 3. 접촉경로 > 4. 증상 > 5. 조치방안

(function() {
// 1단계: 노출물질 카테고리
const substanceCategories = {
    sedative: {
        id: 'sedative',
        name: '진정제·항정신병약제·수면제',
        icon: '💊',
        hasSubDetails: true
    },
    painkiller: {
        id: 'painkiller',
        name: '진통제·항류마티스제',
        icon: '💊',
        hasSubDetails: true
    },
    antidepressant: {
        id: 'antidepressant',
        name: '항우울제',
        icon: '💊',
        hasSubDetails: true
    },
    bloodpressure: {
        id: 'bloodpressure',
        name: '혈압약',
        icon: '💊',
        hasSubDetails: true
    },
    cold: {
        id: 'cold',
        name: '감기·기침약·항히스타민제',
        icon: '💊',
        hasSubDetails: false
    },
    anticonvulsant: {
        id: 'anticonvulsant',
        name: '항경련제',
        icon: '💊',
        hasSubDetails: false
    },
    pesticide: {
        id: 'pesticide',
        name: '농약',
        icon: '🌾',
        hasSubDetails: true
    },
    chemical: {
        id: 'chemical',
        name: '인공독성물질',
        icon: '🧠',
        hasSubDetails: true
    },
    natural: {
        id: 'natural',
        name: '자연독성물질 (식물, 동물)',
        icon: '🌿',
        hasSubDetails: true
    },
    gas: {
        id: 'gas',
        name: '가스',
        icon: '💨',
        hasSubDetails: true
    }
};

// 2단계: 세부 노출물질
const substanceDetails = {
    sedative: {
        'benzodiazepine': { name: '벤조디아제핀계', hasRoute: true },
        'zolpidem': { name: '졸피뎀', hasRoute: true },
        'other_sedative': { name: '기타진정제', hasRoute: true },
        'other_antipsychotic': { name: '기타항정신병약', hasRoute: true },
        'other_sleeping': { name: '기타수면제', hasRoute: true }
    },
    painkiller: {
        'acetaminophen': { name: '아세트아미노펜 포함된 진통해열제·항류마티스제', hasRoute: true },
        'opioid': { name: '마약성진통제 포함된 진통해열제·항류마티스제', hasRoute: true },
        'salicylic': { name: '살리실산 포함된 진통해열제·항류마티스제', hasRoute: true }
    },
    antidepressant: {
        'tricyclic': { name: '삼환계항우울제', hasRoute: true },
        'lithium': { name: '리튬', hasRoute: true },
        'ssri': { name: '선택적세로토닌 수용체억제제 (SSRI)', hasRoute: true },
        'other_antidepressant': { name: '기타항우울제', hasRoute: true }
    },
    bloodpressure: {
        'calcium_channel': { name: '칼슘채널차단제', hasRoute: true },
        'beta_blocker': { name: '베타차단제', hasRoute: true },
        'ace_inhibitor': { name: '안지오텐신전환효소억제제 (ACEi)', hasRoute: true },
        'other_cardiovascular': { name: '기타심혈관계 약물', hasRoute: true }
    },
    pesticide: {
        'organophosphate': { name: '살충제 (유기인계, 카바메이트 등)', hasRoute: true },
        'other_pesticide': { name: '기타농약', hasRoute: true }
    },
    chemical: {
        'bleach': { name: '차아염소산나트륨 포함 가정용품 (소독·살균제제)', hasRoute: true },
        'corrosive': { name: '부식성물질 (빙초산, 산성물질, 알칼리성물질, 불산 등)', hasRoute: true },
        'alcohol': { name: '알코올 (메탄올, 에틸렌글리콜 등)', hasRoute: true },
        'heavy_metal': { name: '중금속 (납, 수은, 비소 등)', hasRoute: true },
        'household': { name: '가정용품 (화장품, 청소용품, 세탁용품 등)', hasRoute: true },
        'nicotine': { name: '담배/니코틴/전자담배 제품', hasRoute: true }
    },
    natural: {
        'mushroom': { name: '독버섯', hasRoute: true },
        'herb': { name: '자리공 (약초)', hasRoute: true },
        'other_plant': { name: '기타식물', hasRoute: true },
        'bee': { name: '벌', hasRoute: true },
        'snake': { name: '뱀', hasRoute: true },
        'marine': { name: '해양동물', hasRoute: true },
        'other_animal': { name: '기타동물', hasRoute: true }
    },
    gas: {
        'carbon_monoxide': { name: '일산화탄소', hasRoute: true },
        'other_gas': { name: '기타가스', hasRoute: true }
    }
};

// 3단계: 접촉 경로
const exposureRoutes = {
    skin: { id: 'skin', name: '피부접촉', icon: '🧴' },
    eye: { id: 'eye', name: '눈(안점막) 노출', icon: '👁️' },
    inhalation: { id: 'inhalation', name: '흡입', icon: '💨' },
    ingestion: { id: 'ingestion', name: '구강섭취', icon: '🍽️' },
    bite: { id: 'bite', name: '쏘임/교상(물림)', icon: '🐛' }
};

// 4단계: 증상 카테고리
const symptomCategories = {
    neurological: {
        id: 'neurological',
        name: '🧠 신경계',
        symptoms: ['어지러움', '두통', '의식변화', '운동이상', '실신', '떨림', '경직', '경련발작']
    },
    cardiovascular: {
        id: 'cardiovascular',
        name: '❤️ 심혈관계',
        symptoms: ['흉통', '고혈압', '저혈압', '빈맥', '서맥', '심정지']
    },
    respiratory: {
        id: 'respiratory',
        name: '🧠 호흡기계',
        symptoms: ['호흡곤란', '호흡저하', '청색증', '거품섞인분비물']
    },
    digestive: {
        id: 'digestive',
        name: '🧠 소화기계',
        symptoms: ['복통', '복부팽만', '구역,구토', '출혈성구토,혈변', '설사']
    },
    systemic: {
        id: 'systemic',
        name: '🧠 기타전신증상',
        symptoms: ['고체온', '저체온', '홍조', '발한', '자극성발진']
    },
    ocular: {
        id: 'ocular',
        name: '👁 안과계',
        symptoms: ['시야흐림', '눈부심', '통증지속', '눈물,충혈지속', '작열감지속', '변색']
    },
    none: {
        id: 'none',
        name: '❌ 증상없음',
        symptoms: []
    }
};

// 5단계: 조치방안 데이터
// 구조: [물질카테고리][세부물질][접촉경로] = 조치방안
const treatmentPlans = {
    // 진정제·항정신병약제·수면제
    sedative: {
        benzodiazepine: {
            ingestion: {
                steps: [
                    { number: '1️⃣', title: '즉시 복용 중단 및 약물 확인', content: '약 복용을 중단하고, 복용한 약 이름·용량·복용시간·정수를 기록합니다. 약통이나 포장을 그대로 보관해 병원에 지참합니다.' },
                    { number: '2️⃣', title: '토하지 말고 안정 유지', content: '억지로 토하지 않습니다. 입안의 잔여약물은 헹구어 뱉고, 물은 조금만 마십니다. 안정된 자세로 휴식합니다.' },
                    { number: '3️⃣', title: '즉시 병원(응급실) 내원', content: '모든 벤조디아제핀계 약물 과량복용은 병원치료가 필요합니다. 특히 의식저하, 경련, 호흡곤란 등 증상이 있으면 즉시 119 신고 또는 응급실 이동합니다.' }
                ],
                warnings: ['토하기 시도', '커피·술 마시기', '집에서 관찰만 하기']
            }
        },
        zolpidem: {
            ingestion: {
                steps: [
                    { number: '1️⃣', title: '즉시 복용 중단 및 약물 확인', content: '복용을 멈추고 약이름, 복용량, 복용시간, 수량을 메모합니다. 약봉투·포장·남은약은 그대로 병원에 지참합니다.' },
                    { number: '2️⃣', title: '토하지 말기', content: '억지로 토하면 기도로 약물이 들어가 폐손상 위험이 있습니다. 입안에 남은약은 뱉고, 물은 소량만 마십니다.' },
                    { number: '3️⃣', title: '의식·호흡상태 확인', content: '졸림, 어눌한 말투, 느린호흡, 반응둔화, 의식저하가 나타나면 즉시 119 신고 후 응급실로 이동합니다.' },
                    { number: '4️⃣', title: '즉시 병원(응급실) 내원', content: '증상이 경미해도 반드시 의료기관 평가가 필요합니다.' }
                ],
                warnings: ['스스로 토하기', '커피나 에너지음료 섭취', '자면 괜찮겠지 하며 방치']
            }
        }
    },
    // 진통제·항류마티스제
    painkiller: {
        acetaminophen: {
            ingestion: {
                steps: [
                    { number: '1️⃣', title: '즉시 복용 중단 및 약물 확인', content: '약을 더 이상 복용하지 말고, 복용한 약의 이름·함량·복용량·시간을 메모합니다. 약통이나 포장을 그대로 보관해 병원에 지참합니다.' },
                    { number: '2️⃣', title: '토하지 말고 안정 유지', content: '억지로 토하지 않습니다. 입안의 잔여약물은 헹구어 뱉고, 물은 조금만 마십니다. 안정된 자세로 휴식하며, 두통·구토·복통이 있으면 즉시 의료기관으로 이동합니다.' },
                    { number: '3️⃣', title: '즉시 병원(응급실) 내원', content: '복용량이 불명확하거나 1회 4g(아세트아미노펜 기준) 이상 복용시 증상이 없어도 반드시 응급실로 갑니다. 초기증상이 없더라도 24~48시간 후 간손상이 나타날 수 있습니다.' },
                    { number: '4️⃣', title: '증상 관찰 중 주의사항', content: '오심, 구토, 복통, 황달, 피로감, 어지럼 등이 나타나면 즉시 응급실로 재내원. 알코올과 병용복용은 간독성을 더욱 증가시킵니다.' }
                ],
                warnings: ['토하기 또는 약 스스로 배출하려 시도하지 말기', '우유·식초·해독음료 등 민간요법 사용금지', '증상없다고 자가판단하여 병원방문 미루기']
            }
        }
    },
    // 항우울제
    antidepressant: {
        tricyclic: {
            ingestion: {
                steps: [
                    { number: '1️⃣', title: '즉시 복용 중단 및 약물 확인', content: '약 복용을 중단하고, 복용한 약 이름·용량·복용시간·정수(몇알)을 기록합니다. 약통이나 포장은 그대로 병원에 지참합니다.' },
                    { number: '2️⃣', title: '토하지 말고 안정 유지', content: '억지로 토하지 않습니다. 의식이 흐리거나 구토중인 경우, 눕히되 옆으로 돌려 기도가 막히지 않게 합니다. 의식이 또렷하면 물만 조금 마시고 조용히 휴식합니다.' },
                    { number: '3️⃣', title: '즉시 응급실 내원', content: '모든 항우울제 과량복용은 병원치료가 필요합니다. 특히 다음 경우는 지체없이 119 신고 또는 응급실 이동: 복용량이 불명확하거나 다약제(수면제·술 등) 병용, 의식저하, 경련, 불안·초조, 빠른 맥박, 구토, 어지럼, 호흡곤란 등 증상 발생' },
                    { number: '4️⃣', title: '증상 관찰 중 주의사항', content: '입마름, 어지럼, 혼돈, 손떨림, 구토, 발열이 생기면 악화신호입니다. 항우울제 중 세로토닌 작용약물(예: 플루옥세틴, 설트랄린)은 세로토닌 증후군(고열·근육경직·혼돈)이 발생할 수 있습니다.' }
                ],
                warnings: ['스스로 토하기', '커피·술 마시기 (심장자극, 독성강화)', '"괜찮아졌다"며 집에서 관찰만 하기', '수면제·진정제 추가복용']
            }
        }
    },
    // 농약
    pesticide: {
        organophosphate: {
            skin: {
                steps: [
                    { number: '1️⃣', title: '즉시 노출 중단', content: '농약이 묻은 작업을 즉시 멈추고, 오염된 장소에서 벗어납니다. 장갑·옷·신발 등 오염된 의류를 즉시 벗깁니다.' },
                    { number: '2️⃣', title: '피부세척(15분 이상)', content: '오염된 옷을 벗기고 비눗물로 충분히 씻어냅니다. 특히 손톱 밑, 귀 뒤 등 피부가 얇은 부위는 더 신경 써서 씻어냅니다. 문지르지 말고, 가볍게 두드리듯이 씻어냅니다. 미온수와 비누로 피부를 부드럽게 문지르며 흐르는 물로 15분 이상 세척합니다. 특히 손가락 사이, 손목, 귀뒤, 목부위 등 잔류가능 부위까지 꼼꼼히 씻습니다. 고압수나 솔로 문지르지 말고, 자극없이 충분히 헹굽니다.' },
                    { number: '3️⃣', title: '눈·입·코 주변 주의', content: '농약이 얼굴에 튄 경우 눈을 감은 채 깨끗한 물로 눈을 10~15분 세척합니다. 입안에 들어갔을 경우 삼키지 말고 물로 여러 번 헹군 뒤 뱉어냅니다.' },
                    { number: '4️⃣', title: '증상 확인 및 병원 내원', content: '피부 통증, 홍반, 가려움, 부종, 구역감, 어지럼, 구토 등의 증상이 나타나면 즉시 병원(응급실 또는 피부과)에 방문합니다. 특히 유기인계 농약, 파라콰트(Gramoxone) 등 독성 강한 농약은 피부 흡수만으로도 위험하므로 증상이 없더라도 의료기관 평가를 받는 것이 안전합니다. 증상이 심하면 병원에 방문합니다.' }
                ],
                warnings: ['뜨거운 물이나 알코올로 닦지 말기(피부자극·흡수증가 위험)', '크림·연고를 임의로 바르지 말기(농약성분 봉쇄 우려)', '오염된 옷을 다시 입지 말기', '강한 세정제 사용', '고압수나 솔로 문지르기']
            },
            inhalation: {
                steps: [
                    { number: '1️⃣', title: '즉시 환기·대피', content: '청소나 작업을 멈추고 창문을 열어 환기하세요. 냄새가 나는 곳에서 벗어나 신선한 공기가 있는 곳으로 이동합니다.' },
                    { number: '2️⃣', title: '호흡안정', content: '조용히 쉬며 천천히 호흡합니다. 기침, 어지럼, 가슴답답함, 구토 등이 생기면 즉시 119 또는 병원으로 이동합니다.' },
                    { number: '3️⃣', title: '눈·피부자극시 세척', content: '눈: 깨끗한 물이나 생리식염수로 10~15분 세척, 피부: 오염된 옷을 벗기고 흐르는 물로 15분 이상 씻기' },
                    { number: '4️⃣', title: '병원내원 필요', content: '호흡곤란, 두통, 구토, 어지럼 지속시, 밀폐된 공간에서 노출된 경우, 어린이·노인·임산부·심장·폐질환자' }
                ],
                warnings: ['냄새확인을 위해 다시 접근하지 말것', '마스크 없이 청소·환기하지 말것', '기침시 음식·물 섭취금지']
            },
            ingestion: {
                steps: [
                    { number: '1️⃣', title: '즉시 119 신고 및 응급실 이송', content: '농약 섭취는 매우 위험합니다. 즉시 119에 신고하고 응급실로 이동합니다.' },
                    { number: '2️⃣', title: '절대 억지 구토유도 금지', content: '스스로 토하지 않습니다. 의료진의 지시에 따라야 합니다.' },
                    { number: '3️⃣', title: '의식이 명확하면 물 소량 섭취 가능', content: '의식이 또렷하고 삼킬 수 있을 때만 물을 소량 마십니다. 과량은 금지합니다.' },
                    { number: '4️⃣', title: '증상 확인', content: '구토, 복통, 설사, 시야흐림, 혼수, 호흡곤란 등 증상을 확인하고 의료진에게 알립니다.' }
                ],
                warnings: ['스스로 토하기', '우유나 식초 마시기', '집에서 관찰만 하기']
            }
        }
    },
    // 락스 (차아염소산나트륨)
    chemical: {
        bleach: {
            skin: {
                steps: [
                    { number: '1️⃣', title: '즉시 물로 세척', content: '흐르는 미온수로 10~15분 이상 충분히 씻습니다. 비누 사용 가능(자극없는 약한 비누). 문지르지 말고 흐르는 물로 충분히 헹구는 것이 핵심.' },
                    { number: '2️⃣', title: '오염된 의류 제거', content: '락스가 닿은 옷·장갑은 즉시 벗기고 피부를 계속 세척.' },
                    { number: '3️⃣', title: '증상 확인', content: '일시적 따가움·건조함·홍반은 비교적 흔함. 통증, 물집, 지속되는 발적이 있으면 자극성 화학화상 가능.' },
                    { number: '4️⃣', title: '병원 내원 기준', content: '통증이 1시간 이상 지속, 뜨겁거나 화끈거림 심함, 물집 형성, 넓은 부위 노출, 기존 피부질환(아토피, 상처 등)이 있는 경우' }
                ],
                warnings: ['식초, 소다 등 섞어 바르기 (화학반응 위험)', '알코올·강한 세정제 사용', '과도한 문지르기', '얼음 직접 대기(피부자극)']
            },
            eye: {
                steps: [
                    { number: '1️⃣', title: '즉시 눈 세척 시작(가장 중요)', content: '즉시 깨끗한 흐르는 물로 15–20분 이상 연속 세척. 생리식염수가 있으면 사용, 없으면 수돗물이 더 빠르면 수돗물이 우선. 눈을 가볍게 벌려 물이 안쪽까지 충분히 흐르도록. 렌즈 착용 중이면 가능한 빨리 제거 후 세척 계속.' },
                    { number: '2️⃣', title: '반대쪽 눈 오염 방지', content: '얼굴을 한쪽으로 기울여, 세척한 물이 깨끗한 눈으로 흐르지 않도록 조절' },
                    { number: '3️⃣', title: '세척 후 증상 확인', content: '작열감, 따가움, 눈물, 시야흐림, 충혈, 이물감. 고농도 락스 또는 증상 지속시 즉시 진료 필요' },
                    { number: '4️⃣', title: '병원(응급실·안과) 내원 기준', content: '통증·따가움·시야흐림이 남아있음, 눈이 잘 안 떠짐, 충혈이 심하게 지속, 고농도 락스(5~6% 이상) 노출, 세척까지 10분 이상 지연된 경우' }
                ],
                warnings: ['안약·연고 임의 사용(반응 악화 가능)', '눈 비비기', '식초·소다 등 "중화" 시도', '찬물 얼음 찜질 (자극 증가 우려)']
            },
            ingestion: {
                steps: [
                    { number: '1️⃣', title: '즉시 환기시키기', content: '오염된 공간에서 벗어나 신선한 공기가 있는 곳으로 이동합니다.' },
                    { number: '2️⃣', title: '입안을 충분히 헹구기', content: '깨끗한 물로 여러 번 헹구되, 헹군 물은 절대 삼키지 않습니다.' },
                    { number: '3️⃣', title: '물 또는 우유 마시기 (소량, 천천히)', content: '의식이 명확하고 삼킬 수 있을 때만 1컵(약 200mL) 정도 천천히 마십니다. 위자극을 줄여 락스 농도를 희석합니다.' },
                    { number: '4️⃣', title: '토하거나 산성음료 마시지 않기', content: '구토유도나 식초·레몬즙 등은 금지합니다. 식도·위 손상과 염소가스 발생 위험이 있습니다.' },
                    { number: '5️⃣', title: '피부나 옷 오염시 세척하기', content: '오염된 옷은 벗기고, 피부는 흐르는 물로 15분 이상 씻습니다.' },
                    { number: '6️⃣', title: '증상 발생시 즉시 병원 이동', content: '구토, 통증, 기침, 쉰목소리, 호흡곤란 등이 있으면 즉시 응급실로 이동합니다.' }
                ],
                warnings: ['구토 유도', '식초·레몬즙 등 산성 음료 마시기', '과도한 물 섭취']
            },
            inhalation: {
                steps: [
                    { number: '1️⃣', title: '즉시 환기', content: '창문을 열고 신선한 공기가 있는 곳으로 이동하세요. 청소를 멈추고, 같은 공간의 사람도 함께 대피합니다.' },
                    { number: '2️⃣', title: '호흡안정', content: '기침이나 목·눈 자극이 있으면 조용히 쉬며 안정하세요. 심한 기침·가슴통증·호흡곤란이 생기면 즉시 병원으로 이동합니다.' },
                    { number: '3️⃣', title: '증상 완화', content: '눈이 따갑다면 생리식염수나 깨끗한 물로 10~15분 세척합니다. 목이 따가울 때는 미지근한 물을 조금씩 자주 마십니다.' },
                    { number: '4️⃣', title: '피부나 옷에 튄 경우', content: '오염된 옷을 벗기고 흐르는 물로 15분 이상 씻습니다.' },
                    { number: '5️⃣', title: '응급실 내원이 필요한 경우', content: '호흡곤란·가슴통증·쉰목소리·눈통증 지속시, 천식·심장질환 등 기저질환이 있을 때' }
                ],
                warnings: ['식초 등 산성물질로 중화하려 하지 말것', '재흡입·냄새 확인 시도 금지']
            }
        }
    },
    // 자연독성물질
    natural: {
        mushroom: {
            ingestion: {
                steps: [
                    { number: '1️⃣', title: '즉시 섭취 중단 및 토하지 말기', content: '야생버섯을 먹었다면 즉시 섭취를 중단하고 남은 버섯을 보관하거나 사진으로 찍어두세요. 억지로 토하면 식도 손상 위험이 있으므로 토하지 않습니다.' },
                    { number: '2️⃣', title: '증상 여부와 시간 확인', content: '복통, 구토, 설사, 어지럼, 발한, 혼돈, 경련, 황달 등의 증상이 있으면 섭취 시간과 증상 시작 시점을 메모해둡니다. 일부 독버섯(예: 아마니타속)은 6~24시간 후 지연 증상이 나타날 수 있으므로 무증상이어도 반드시 병원으로 이동해야 합니다.' },
                    { number: '3️⃣', title: '즉시 의료기관 (응급실) 내원', content: '섭취량이 적더라도 반드시 응급실로 내원합니다. 가능하다면 먹은 버섯(남은 것 또는 사진)을 가져가면 독성 식별에 도움이 됩니다. 증상 유무와 관계없이 전문 치료가 필요합니다.' },
                    { number: '4️⃣', title: '동반자도 함께 진료', content: '함께 먹은 사람이 있다면 증상이 없어도 모두 병원 진료를 받아야 합니다. 동일한 독버섯을 섭취했을 가능성이 높습니다.' }
                ],
                warnings: ['민간요법 (우유, 술, 된장국 등)으로 해독하려 하지 말기', '집에서 기다리거나 "괜찮을 것 같다"고 방치하지 말기', '토하거나 설사약을 임의로 복용하지 말기']
            }
        },
        bee: {
            bite: {
                steps: [
                    { number: '1️⃣', title: '벌침 제거', content: '벌침이 남아있다면 핀셋이나 신용카드 모서리로 피부를 눌러 밀어내듯 제거합니다. 손가락으로 짜내거나 비틀면 독이 더 퍼질 수 있으므로 주의합니다.' },
                    { number: '2️⃣', title: '상처 부위 세척', content: '깨끗한 비누와 미온수로 상처 부위를 씻어 세균 감염을 예방합니다.' },
                    { number: '3️⃣', title: '냉찜질하기', content: '수건에 싼 얼음팩을 상처 부위에 10~15분 정도 대어 통증·붓기·가려움 완화에 도움을 줍니다. 필요시 1시간 간격으로 반복합니다.' },
                    { number: '4️⃣', title: '통증·가려움 완화', content: '통증이 심하면 진통제(예: 아세트아미노펜)를 복용할 수 있습니다. 가려움이나 붓기가 심하면 항히스타민제(예: 로라타딘, 세티리진) 복용이 도움이 됩니다.' },
                    { number: '5️⃣', title: '병원(응급실) 내원 기준', content: '다음 증상이 하나라도 있으면 즉시 119 신고 또는 응급실 이동합니다: 호흡곤란, 입술·눈 주위 부종, 어지럼증, 구토, 전신 가려움, 의식저하, 목·입안·혀 안쪽 등 위험 부위를 쏘인 경우, 과거 벌 쏘임 후 알레르기 반응(아나필락시스) 경험자' }
                ],
                warnings: ['상처를 손으로 만지거나 빨지 말기', '침을 바르거나 민간요법 (된장, 소금 등) 사용 금지', '벌집 근처로 다시 접근하지 말기']
            }
        }
    },
    // 가스
    gas: {
        carbon_monoxide: {
            inhalation: {
                steps: [
                    { number: '1️⃣', title: '즉시 환기 및 대피', content: '창문과 문을 열어 신선한 공기가 통하게 합니다. 가스가 새는 공간을 벗어나 밖으로 이동하세요. 다른 사람도 함께 대피하도록 안내합니다.' },
                    { number: '2️⃣', title: '호흡안정', content: '조용히 앉거나 누워 안정된 자세를 유지합니다. 어지럽거나 두통이 있으면 움직이지 말고 도움 요청합니다.' },
                    { number: '3️⃣', title: '산소 공급', content: '가능한 경우 100% 산소를 흡입합니다. 증상이 심할 경우 구급대가 도착하면 산소요법 또는 고압산소 치료를 받습니다.' },
                    { number: '4️⃣', title: '병원(응급실) 내원', content: '두통, 어지럼, 구토, 혼돈, 호흡곤란, 의식저하 등 증상이 있으면 즉시 119에 신고 후 응급실로 이동합니다. 임산부, 노인, 심장질환자, 어린이는 무증상이어도 반드시 내원합니다.' }
                ],
                warnings: ['가스 남은 공간 재진입 금지', '임의로 스프레이·흡입제·안약 사용 금지']
            }
        }
    }
};

// 응급 증상 판단
const emergencySymptoms = ['호흡곤란', '의식저하', '경련', '심정지', '호흡저하', '의식변화', '실신'];

// 챗봇 DB 구조를 외부에서 사용할 수 있도록 export
const chatbotDB = {
    substanceCategories,
    substanceDetails,
    exposureRoutes,
    symptomCategories,
    treatmentPlans,
    emergencySymptoms
};

if (typeof window !== 'undefined') {
    window.chatbotDB = chatbotDB;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = chatbotDB;
}
})();

