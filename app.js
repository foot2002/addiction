// 외부 DB 로드 (안전하게 Fallback)
const db = (typeof window !== 'undefined' && window.chatbotDB) ? window.chatbotDB : {};
const substanceCategories = db.substanceCategories || {};
const substanceDetails = db.substanceDetails || {};
const exposureRoutes = db.exposureRoutes || {};
const symptomCategories = db.symptomCategories || {};
const treatmentPlans = db.treatmentPlans || {};
const emergencySymptoms = db.emergencySymptoms || [];

// 페이지 네비게이션 관리
class AppNavigation {
    constructor() {
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupActionButtons();
        this.setupSubstanceButtons();
        this.setupSearch();
        this.setupHospitalSearch();
    }

    setupNavigation() {
        // 페이지 내부 네비게이션 버튼 (모든 페이지)
        const pageNavButtons = document.querySelectorAll('.page-nav-btn, .chatbot-nav-btn');
        pageNavButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pageId = btn.getAttribute('data-page');
                this.navigateToPage(pageId);
            });
        });
    }

    setupActionButtons() {
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action');
                this.handleAction(action);
            });
        });
    }

    setupSubstanceButtons() {
        document.querySelectorAll('.substance-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const substanceId = btn.getAttribute('data-substance');
                this.showSubstanceDetail(substanceId);
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput && searchBtn) {
            const performSearch = () => {
                const query = searchInput.value.trim();
                if (query) {
                    this.searchContent(query);
                } else {
                    // 검색어가 비어있으면 결과 지우기
                    const resultsContainer = document.getElementById('search-results');
                    if (resultsContainer) {
                        resultsContainer.innerHTML = '';
                    }
                }
            };
            
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch();
            });
            
            // 입력 중에도 실시간으로 검색 (선택적)
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    // 2글자 이상일 때만 검색
                    this.searchContent(query);
                } else if (query.length === 0) {
                    // 검색어가 비어있으면 결과 지우기
                    const resultsContainer = document.getElementById('search-results');
                    if (resultsContainer) {
                        resultsContainer.innerHTML = '';
                    }
                }
            });
        }
    }

    setupHospitalSearch() {
        const locationInput = document.getElementById('location-input');
        const locationSearchBtn = document.getElementById('location-search-btn');
        
        if (locationInput && locationSearchBtn) {
            const performHospitalSearch = () => {
                const query = locationInput.value.trim();
                if (query) {
                    this.searchHospitals(query);
                } else {
                    // 검색어가 없으면 안내 메시지 표시
                    const resultsContainer = document.getElementById('hospital-results');
                    if (resultsContainer) {
                        resultsContainer.innerHTML = '<p class="info-text">위치를 입력하여 가까운 응급의료기관을 찾아보세요.</p>';
                    }
                }
            };
            
            locationSearchBtn.addEventListener('click', performHospitalSearch);
            locationInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performHospitalSearch();
            });
        }
    }

    searchHospitals(query) {
        if (!window.searchHospitals) {
            console.error('병원 검색 함수를 찾을 수 없습니다.');
            return;
        }

        const results = window.searchHospitals(query);
        const resultsContainer = document.getElementById('hospital-results');
        
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <p class="info-text">"${query}"에 대한 검색 결과가 없습니다.<br>다른 지역명이나 병원명으로 검색해보세요.</p>
            `;
            return;
        }

        let html = '<div class="hospital-list">';
        results.forEach((hospital, index) => {
            html += `
                <div class="hospital-item">
                    <div class="hospital-header">
                        <span class="hospital-number">${index + 1}</span>
                        <div class="hospital-info">
                            <h3 class="hospital-name">${hospital.name}</h3>
                            <p class="hospital-type">${hospital.type}</p>
                        </div>
                    </div>
                    <div class="hospital-details">
                        <p class="hospital-address">📍 ${hospital.address}</p>
                        <div class="hospital-footer">
                            <span class="hospital-distance">거리: ${hospital.distance}</span>
                            <a href="tel:${hospital.phone}" class="hospital-call-btn">📞 전화하기</a>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        resultsContainer.innerHTML = html;
    }

    navigateToPage(pageId) {
        const currentPageElement = document.querySelector(`.page.active`);
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
        }

        const newPageElement = document.getElementById(pageId);
        if (newPageElement) {
            newPageElement.classList.add('active');
            this.currentPage = pageId;

            // 모든 페이지 내부 네비게이션 버튼 활성화
            document.querySelectorAll('.page-nav-btn, .chatbot-nav-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-page') === pageId) {
                    btn.classList.add('active');
                }
            });

            // 챗봇 페이지로 이동 시 자동 초기화
            if (pageId === 'chatbot' && typeof ChatbotManager !== 'undefined') {
                // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 초기화
                setTimeout(() => {
                    ChatbotManager.start();
                }, 100);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    handleAction(action) {
        switch(action) {
            case 'start-chatbot':
                this.navigateToPage('chatbot');
                ChatbotManager.start();
                break;
            case 'show-guide':
                this.navigateToPage('guide');
                break;
            case 'find-hospital':
                this.navigateToPage('hospital');
                break;
            case 'back-to-home':
                this.navigateToPage('home');
                break;
        }
    }

    showSubstanceDetail(substanceId) {
        const substance = substanceData[substanceId];
        if (!substance) return;

        const detailPage = document.getElementById('substance-detail');
        if (!detailPage) return;

        let html = `
            <div class="card">
                <div class="card-header">
                    <button class="back-btn" onclick="app.navigateToPage('guide')">←</button>
                    <h2>${substance.icon} ${substance.title}</h2>
                </div>
                <div class="card-body">
        `;

        if (substance.qa) {
            html += `
                <div class="qa-box">
                    <p class="qa-question">${substance.qa}</p>
                </div>
            `;
        }

        html += '<div class="emergency-steps">';
        substance.steps.forEach(step => {
            html += `
                <div class="emergency-step">
                    <div class="step-number">${step.number}</div>
                    <div class="step-content">
                        <h3>${step.title}</h3>
                        <p>${step.content}</p>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        if (substance.warnings && substance.warnings.length > 0) {
            html += `
                <div class="warning-box">
                    <strong>⚠️ 주의사항</strong>
                    <ul>
            `;
            substance.warnings.forEach(warning => {
                html += `<li>${warning}</li>`;
            });
            html += `
                    </ul>
                </div>
            `;
        }

        html += `
                    <div class="action-buttons-bottom">
                        <a href="tel:119" class="emergency-btn">119 신고</a>
                        <a href="tel:1339" class="emergency-btn secondary">1339 응급의료정보센터</a>
                        <button class="chat-action-btn" onclick="app.navigateToPage('chatbot'); ChatbotManager.start();">
                            💬 챗봇 상담하기
                        </button>
                    </div>
                </div>
            </div>
        `;

        detailPage.innerHTML = html;
        this.navigateToPage('substance-detail');
    }

    searchContent(query) {
        if (!query || query.trim() === '') {
            const resultsContainer = document.getElementById('search-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
            }
            return;
        }

        const searchTerm = query.toLowerCase().trim();
        const results = [];
        
        // 중독물질 검색 (substanceData)
        if (typeof substanceData !== 'undefined') {
            Object.keys(substanceData).forEach(key => {
                const substance = substanceData[key];
                const nameMatch = substance.name.toLowerCase().includes(searchTerm);
                const titleMatch = substance.title.toLowerCase().includes(searchTerm);
                const qaMatch = substance.qa && substance.qa.toLowerCase().includes(searchTerm);
                
                if (nameMatch || titleMatch || qaMatch) {
                    results.push({ 
                        type: 'substance', 
                        id: key, 
                        name: substance.name, 
                        title: substance.title,
                        icon: substance.icon,
                        description: substance.qa || substance.title
                    });
                }
            });
        }

        // 증상 검색 (symptomCategories)
        if (typeof symptomCategories !== 'undefined') {
            Object.values(symptomCategories).forEach(category => {
                if (category.id === 'none') return;
                
                // 카테고리명 검색
                if (category.name.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'symptom_category',
                        id: category.id,
                        name: category.name,
                        description: `${category.symptoms.length}개 증상 포함`
                    });
                }
                
                // 개별 증상 검색
                if (category.symptoms && Array.isArray(category.symptoms)) {
                    category.symptoms.forEach(symptom => {
                        if (symptom.toLowerCase().includes(searchTerm)) {
                            results.push({
                                type: 'symptom',
                                id: symptom,
                                name: symptom,
                                category: category.name,
                                description: `${category.name} 증상`
                            });
                        }
                    });
                }
            });
        }

        // 검색 결과 표시
        this.displaySearchResults(query, results);
    }

    displaySearchResults(query, results) {
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="search-no-results">
                    <p>"${query}"에 대한 검색 결과가 없습니다.</p>
                    <p class="search-hint">다른 검색어를 시도해보세요.</p>
                </div>
            `;
            return;
        }

        let html = `<div class="search-results-header">
            <h4>"${query}" 검색 결과 (${results.length}개)</h4>
        </div>`;

        html += '<div class="search-results-list">';
        
        results.forEach((result, index) => {
            if (result.type === 'substance') {
                html += `
                    <div class="search-result-item substance-result" onclick="app.showSubstanceDetail('${result.id}')">
                        <div class="result-icon">${result.icon || '💊'}</div>
                        <div class="result-content">
                            <h5 class="result-title">${result.name}</h5>
                            <p class="result-desc">${result.description || result.title}</p>
                            <span class="result-type">중독물질</span>
                        </div>
                        <div class="result-arrow">→</div>
                    </div>
                `;
            } else if (result.type === 'symptom_category') {
                html += `
                    <div class="search-result-item symptom-result">
                        <div class="result-icon">🧠</div>
                        <div class="result-content">
                            <h5 class="result-title">${result.name}</h5>
                            <p class="result-desc">${result.description}</p>
                            <span class="result-type">증상 카테고리</span>
                        </div>
                    </div>
                `;
            } else if (result.type === 'symptom') {
                html += `
                    <div class="search-result-item symptom-result">
                        <div class="result-icon">⚠️</div>
                        <div class="result-content">
                            <h5 class="result-title">${result.name}</h5>
                            <p class="result-desc">${result.description}</p>
                            <span class="result-type">증상</span>
                        </div>
                    </div>
                `;
            }
        });

        html += '</div>';
        resultsContainer.innerHTML = html;
    }
}

// 챗봇 관리자 - 순서대로 질문하는 구조
class ChatbotManager {
    constructor() {
        this.currentStep = 'welcome'; // welcome > category > detail > route > symptom > result
        this.selectedCategory = null;      // 1단계: 노출물질 카테고리
        this.selectedDetail = null;         // 2단계: 세부 노출물질
        this.selectedRoute = null;          // 3단계: 접촉 경로
        this.selectedSymptoms = [];         // 4단계: 증상
        this.messages = [];
    }

    static start() {
        if (!window.chatbotInstance) {
            window.chatbotInstance = new ChatbotManager();
        }
        window.chatbotInstance.init();
    }

    init() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        // 현재 단계가 welcome이 아니면 초기화
        if (this.currentStep !== 'welcome') {
            this.restart();
            return;
        }

        // 메시지 컨테이너가 비어있거나 초기 메시지만 있는 경우에만 추가
        const existingMessages = messagesContainer.querySelectorAll('.message');
        if (existingMessages.length <= 1) {
            // 기존 메시지 정리 (HTML의 기본 메시지 제외)
            const defaultMessage = messagesContainer.querySelector('.message');
            if (defaultMessage && defaultMessage.textContent.includes('안녕하세요')) {
                messagesContainer.innerHTML = '';
            }

            // 초기 메시지
            const noticeText = `• 본 챗봇은 약물·농약·화학제품 등 독성물질 노출시 초기대응 정보를 제공합니다.
• 입력된 노출물질과 증상을 바탕으로 정보를 제공하고, 필요시 119 신고 및 응급의료기관 안내를 제공합니다.
• 정확한 물질명(또는 제품명)을 확인해 주세요.
• 호흡곤란·의식저하·경련·대량섭취·흡입시 즉시 119 신고 또는 응급실로 이동하십시오.
• 본 정보는 의료전문가의 진단·치료를 대체하지 않으며, 참고용으로만 제공됩니다.
• 최종판단과 책임은 사용자에게 있습니다.

계속 진행하시겠습니까?`;

            this.addBotMessage(noticeText);
        }

        // 액션 버튼 설정
        const actionsContainer = document.getElementById('chatbot-actions');
        if (actionsContainer) {
            actionsContainer.innerHTML = `
                <button class="chat-action-btn" onclick="ChatbotManager.getInstance().handleContinue()">확인</button>
                <button class="chat-action-btn secondary" onclick="app.navigateToPage('home')">취소</button>
            `;
        }
    }

    static getInstance() {
        return window.chatbotInstance || new ChatbotManager();
    }

    addBotMessage(text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${text.split('\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('')}
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addUserMessage(text) {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleContinue() {
        this.currentStep = 'category';
        this.askStep1_Category();
    }

    // 1단계: 노출물질 카테고리 선택
    askStep1_Category() {
        this.addBotMessage("노출물질을 선택하거나 검색해주세요");
        
        const actionsContainer = document.getElementById('chatbot-actions');
        if (!actionsContainer) return;

        let html = '<div class="substance-selection-grid">';
        
        Object.values(substanceCategories).forEach(category => {
            html += `
                <button class="substance-select-btn" onclick="ChatbotManager.getInstance().selectCategory('${category.id}')">
                    <span>${category.icon}</span>
                    <span>${category.name}</span>
                </button>
            `;
        });

        html += '</div>';
        html += '<button class="chat-action-btn" onclick="ChatbotManager.getInstance().showSearch()">🔎 노출물질 검색</button>';
        
        actionsContainer.innerHTML = html;
    }

    selectCategory(categoryId) {
        this.selectedCategory = categoryId;
        const category = substanceCategories[categoryId];
        
        if (!category) return;

        this.addUserMessage(category.name);

        // 세부 물질이 있는지 확인
        if (category.hasSubDetails && substanceDetails[categoryId]) {
            this.currentStep = 'detail';
            this.askStep2_Detail();
        } else {
            // 세부 물질이 없으면 접촉 경로로 넘어감
            this.currentStep = 'route';
            this.askStep3_Route();
        }
    }

    // 2단계: 세부 노출물질 선택
    askStep2_Detail() {
        const details = substanceDetails[this.selectedCategory];
        if (!details || Object.keys(details).length === 0) {
            // 세부 물질이 없으면 다음 단계로
            this.currentStep = 'route';
            this.askStep3_Route();
            return;
        }

        this.addBotMessage("세부노출물질을 선택하거나 검색해주세요.\n★ 약병이나 약설명서에 있는 약성분을 확인해주세요.");
        
        const actionsContainer = document.getElementById('chatbot-actions');
        if (!actionsContainer) return;

        let html = '<div class="substance-detail-list">';
        
        Object.entries(details).forEach(([key, detail]) => {
            html += `
                <button class="substance-detail-btn" onclick="ChatbotManager.getInstance().selectDetail('${key}')">
                    ${detail.name}
                </button>
            `;
        });

        html += '</div>';
        html += '<button class="chat-action-btn secondary" onclick="ChatbotManager.getInstance().askStep1_Category()">← 뒤로</button>';
        
        actionsContainer.innerHTML = html;
    }

    selectDetail(detailKey) {
        const details = substanceDetails[this.selectedCategory];
        if (!details || !details[detailKey]) return;

        this.selectedDetail = detailKey;
        this.addUserMessage(details[detailKey].name);

        // 접촉 경로가 필요한지 확인
        if (details[detailKey].hasRoute) {
            this.currentStep = 'route';
            this.askStep3_Route();
        } else {
            // 접촉 경로가 없으면 증상으로 넘어감
            this.currentStep = 'symptom';
            this.askStep4_Symptom();
        }
    }

    // 3단계: 접촉 경로 선택
    askStep3_Route() {
        // 접촉 경로가 필요한 물질인지 확인
        const needsRoute = this.checkIfNeedsRoute();
        
        if (!needsRoute) {
            // 접촉 경로가 필요 없으면 증상으로 넘어감
            this.currentStep = 'symptom';
            this.askStep4_Symptom();
            return;
        }

        this.addBotMessage("섭취 및 접촉 경로를 선택해주세요");
        
        const actionsContainer = document.getElementById('chatbot-actions');
        if (!actionsContainer) return;

        let html = '<div class="route-selection-list">';
        
        Object.values(exposureRoutes).forEach(route => {
            html += `
                <button class="route-select-btn" onclick="ChatbotManager.getInstance().selectRoute('${route.id}')">
                    ${route.icon} ${route.name}
                </button>
            `;
        });

        html += '</div>';
        html += '<button class="chat-action-btn secondary" onclick="ChatbotManager.getInstance().goBack()">← 뒤로</button>';
        
        actionsContainer.innerHTML = html;
    }

    selectRoute(routeId) {
        const route = exposureRoutes[routeId];
        if (!route) return;

        this.selectedRoute = routeId;
        this.addUserMessage(route.name);

        this.currentStep = 'symptom';
        this.askStep4_Symptom();
    }

    // 4단계: 증상 선택
    askStep4_Symptom() {
        this.addBotMessage("노출 후 증상을 선택하거나 검색해 주세요.");
        
        const actionsContainer = document.getElementById('chatbot-actions');
        if (!actionsContainer) return;

        let html = '<div class="symptom-selection-grid">';
        
        Object.values(symptomCategories).forEach(category => {
            if (category.id === 'none') return; // 증상없음은 별도 처리
            html += `
                <button class="symptom-category-btn" onclick="ChatbotManager.getInstance().showSymptomDetails('${category.id}')">
                    ${category.name}
                </button>
            `;
        });

        html += '</div>';
        html += '<button class="chat-action-btn" onclick="ChatbotManager.getInstance().skipSymptoms()">❌ 증상없음</button>';
        html += '<button class="chat-action-btn" onclick="ChatbotManager.getInstance().showSearch()">🔎 주증상, 세부증상 검색</button>';
        html += '<button class="chat-action-btn secondary" onclick="ChatbotManager.getInstance().goBack()">← 뒤로</button>';
        
        actionsContainer.innerHTML = html;
    }

    showSymptomDetails(categoryId) {
        const category = symptomCategories[categoryId];
        if (!category || !category.symptoms || category.symptoms.length === 0) return;

        const actionsContainer = document.getElementById('chatbot-actions');
        if (!actionsContainer) return;

        let html = `<p class="category-title">${category.name} 증상 선택</p><div class="symptom-list">`;
        
        category.symptoms.forEach(symptom => {
            html += `
                <button class="symptom-item-btn" onclick="ChatbotManager.getInstance().addSymptom('${symptom}', '${categoryId}')">
                    - ${symptom}
                </button>
            `;
        });

        html += '</div>';
        html += '<button class="chat-action-btn" onclick="ChatbotManager.getInstance().askStep4_Symptom()">← 뒤로</button>';
        html += '<button class="chat-action-btn" onclick="ChatbotManager.getInstance().showResult()">응급처치법 보기</button>';
        
        actionsContainer.innerHTML = html;
    }

    addSymptom(symptom, categoryId) {
        if (!this.selectedSymptoms.includes(symptom)) {
            this.selectedSymptoms.push(symptom);
            this.addUserMessage(symptom);
        }
        // 증상 선택 시 즉시 긴급 메시지 표시
        this.showResult();
    }

    skipSymptoms() {
        this.addUserMessage("증상 없음");
        this.showResult();
    }

    // 5단계: 결과 및 조치방안 제시
    showResult() {
        // 증상 선택 시 항상 긴급 상황으로 판단
        this.addBotMessage("긴급한상황으로보입니다.\n가까운응급실방문을권장합니다.\n\n응급상황이발생했나요?");
        
        const actionsContainer = document.getElementById('chatbot-actions');
        if (actionsContainer) {
            actionsContainer.innerHTML = `
                <a href="tel:119" class="emergency-btn">지금바로119 호출하기</a>
                <button class="chat-action-btn" onclick="app.navigateToPage('hospital')">주변응급실정보</button>
            `;
        }
    }

    showTreatmentPlan() {
        // 조치방안 데이터 찾기
        const treatment = this.getTreatmentPlan();
        
        if (!treatment) {
            this.addBotMessage("해당 조합에 대한 상세 조치방안이 준비되지 않았습니다.\n일반적인 응급처치 방법을 안내해드리겠습니다.");
            this.showGeneralTreatment();
            return;
        }

        this.addBotMessage("응급처치 방법을 안내해드리겠습니다.");

        let detailText = "";
        treatment.steps.forEach(step => {
            detailText += `${step.number} ${step.title}\n${step.content}\n\n`;
        });

        this.addBotMessage(detailText);

        if (treatment.warnings && treatment.warnings.length > 0) {
            let warningText = "⚠️ 주의사항\n";
            treatment.warnings.forEach(warning => {
                warningText += `❌ ${warning}\n`;
            });
            this.addBotMessage(warningText);
        }

        const actionsContainer = document.getElementById('chatbot-actions');
        if (actionsContainer) {
            actionsContainer.innerHTML = `
                <a href="tel:119" class="emergency-btn">119 신고</a>
                <a href="tel:1339" class="emergency-btn secondary">1339 응급의료정보센터</a>
                <button class="chat-action-btn" onclick="app.navigateToPage('hospital')">주변 응급실 정보</button>
                <button class="chat-action-btn secondary" onclick="ChatbotManager.getInstance().restart()">새 상담 시작</button>
            `;
        }
    }

    getTreatmentPlan() {
        if (!this.selectedCategory) return null;

        const category = treatmentPlans[this.selectedCategory];
        if (!category) return null;

        if (this.selectedDetail) {
            const detail = category[this.selectedDetail];
            if (!detail) return null;

            if (this.selectedRoute) {
                return detail[this.selectedRoute] || null;
            }
        }

        // 접촉 경로가 없거나 세부 물질이 없는 경우, 첫 번째 조치방안 반환
        if (this.selectedDetail && category[this.selectedDetail]) {
            const detail = category[this.selectedDetail];
            const firstRoute = Object.keys(detail)[0];
            return detail[firstRoute] || null;
        }

        return null;
    }

    showGeneralTreatment() {
        const generalSteps = [
            { number: '1️⃣', title: '즉시 노출 중단', content: '독성물질 노출을 즉시 중단하고 안전한 곳으로 이동합니다.' },
            { number: '2️⃣', title: '의료진 상담', content: '가까운 응급실이나 중독전문상담센터에 연락하여 상담을 받습니다.' },
            { number: '3️⃣', title: '증상 관찰', content: '호흡곤란, 의식저하, 경련 등 응급 증상이 나타나면 즉시 119에 신고합니다.' }
        ];

        let detailText = "";
        generalSteps.forEach(step => {
            detailText += `${step.number} ${step.title}\n${step.content}\n\n`;
        });

        this.addBotMessage(detailText);

        const actionsContainer = document.getElementById('chatbot-actions');
        if (actionsContainer) {
            actionsContainer.innerHTML = `
                <a href="tel:119" class="emergency-btn">119 신고</a>
                <a href="tel:1339" class="emergency-btn secondary">1339 응급의료정보센터</a>
                <button class="chat-action-btn" onclick="app.navigateToPage('hospital')">주변 응급실 정보</button>
                <button class="chat-action-btn secondary" onclick="ChatbotManager.getInstance().restart()">새 상담 시작</button>
            `;
        }
    }

    checkIfNeedsRoute() {
        if (!this.selectedCategory) return false;
        
        if (this.selectedDetail) {
            const details = substanceDetails[this.selectedCategory];
            if (details && details[this.selectedDetail]) {
                return details[this.selectedDetail].hasRoute;
            }
        }

        // 일부 카테고리는 접촉 경로가 필수
        const routeRequiredCategories = ['pesticide', 'chemical', 'natural'];
        return routeRequiredCategories.includes(this.selectedCategory);
    }

    goBack() {
        switch(this.currentStep) {
            case 'detail':
                this.selectedDetail = null;
                this.currentStep = 'category';
                this.askStep1_Category();
                break;
            case 'route':
                this.selectedRoute = null;
                if (this.selectedDetail) {
                    this.currentStep = 'detail';
                    this.askStep2_Detail();
                } else {
                    this.currentStep = 'category';
                    this.askStep1_Category();
                }
                break;
            case 'symptom':
                this.selectedSymptoms = [];
                if (this.checkIfNeedsRoute() && !this.selectedRoute) {
                    this.currentStep = 'route';
                    this.askStep3_Route();
                } else if (this.selectedDetail) {
                    this.currentStep = 'detail';
                    this.askStep2_Detail();
                } else {
                    this.currentStep = 'category';
                    this.askStep1_Category();
                }
                break;
            default:
                this.askStep1_Category();
        }
    }

    showSearch() {
        // 검색 기능 (추후 구현)
        alert('검색 기능은 추후 구현 예정입니다.');
    }


    restart() {
        const messagesContainer = document.getElementById('chatbot-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
        this.selectedCategory = null;
        this.selectedDetail = null;
        this.selectedRoute = null;
        this.selectedSymptoms = [];
        this.currentStep = 'welcome';
        this.init();
    }
}

// 앱 초기화
class App {
    constructor() {
        this.navigation = new AppNavigation();
        this.init();
    }

    init() {
        // 글로벌 접근을 위한 참조
        window.app = this;
        window.ChatbotManager = ChatbotManager;
        
        // 응급 연락처 설정
        this.setupEmergencyContacts();
    }

    setupEmergencyContacts() {
        // 모든 전화 링크에 이벤트 리스너 추가 (동적으로 생성되는 요소 포함)
        this.attachPhoneListeners();
        
        // MutationObserver로 동적으로 추가되는 전화 링크도 감지
        const observer = new MutationObserver(() => {
            this.attachPhoneListeners();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    attachPhoneListeners() {
        const contactButtons = document.querySelectorAll('a[href^="tel:"]');
        contactButtons.forEach(btn => {
            // 이미 리스너가 있는지 확인
            if (btn.dataset.phoneListener === 'true') return;
            btn.dataset.phoneListener = 'true';
            
            btn.addEventListener('click', (e) => {
                const phoneNumber = btn.getAttribute('href').replace('tel:', '').trim();
                const phoneName = btn.textContent.trim() || phoneNumber;
                
                // 모바일 기기 감지
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                
                if (isMobile) {
                    // 모바일에서는 확인 없이 바로 전화 앱 열기
                    // tel: 프로토콜이 자동으로 전화 앱을 엽니다
                    console.log(`전화 걸기: ${phoneNumber}`);
                    // 기본 동작 허용 (tel: 링크가 전화 앱을 엽니다)
                } else {
                    // 데스크톱에서는 확인 다이얼로그 표시
                    if (confirm(`${phoneName}로 전화를 걸까요?\n\n번호: ${phoneNumber}\n\n(데스크톱에서는 전화 앱이 열립니다)`)) {
                        // 기본 동작 허용
                        console.log(`전화 걸기: ${phoneNumber}`);
                    } else {
                        // 취소 시 기본 동작 방지
                        e.preventDefault();
                        return false;
                    }
                }
            });
        });
    }

    navigateToPage(pageId) {
        this.navigation.navigateToPage(pageId);
    }

    showSubstanceDetail(substanceId) {
        this.navigation.showSubstanceDetail(substanceId);
    }
}

// 앱 시작
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    console.log('중독 응급처치 챗봇 앱이 시작되었습니다.');
});
