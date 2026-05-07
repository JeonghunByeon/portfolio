const navToggle = document.querySelector(".nav-toggle")
const navLinks = document.querySelectorAll(".nav__link")

navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
})

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        document.body.classList.remove('nav-open')
    })
})

// Help iframe of webgl demos get access to the keyboard by giving them focus when clicked
document.addEventListener("DOMContentLoaded", function () {
    const iframe = document.getElementById("demo");
    if (!iframe) {
        return;
    }
    iframe.addEventListener("load", function () {
        try {
            const iframeDoc = iframe.contentWindow.document;
            iframeDoc.addEventListener("mousedown", function () {
                iframe.contentWindow.Module.canvas.focus();
            });
        } catch (e) {
            console.error(e);
        }
    });
});
const langToggle = document.getElementById('lang-toggle');
const langElements = document.querySelectorAll('.lang');

langToggle.addEventListener('click', () => {
    // 1. 알약 버튼 애니메이션 클래스 토글
    langToggle.classList.toggle('en-active');
    
    // 2. 현재 상태가 영어인지 확인
    const isEnglish = langToggle.classList.contains('en-active');
    

    document.body.classList.toggle('lang-en', isEnglish);

    
    // 3. 모든 .lang 요소를 순회하며 텍스트 변경
    langElements.forEach(el => {
        if (isEnglish) {
            // 영어 모드일 때
            const enText = el.getAttribute('data-en');
            if (enText) el.textContent = enText;
        } else {
            // 한국어 모드일 때
            const koText = el.getAttribute('data-ko');
            if (koText) el.textContent = koText;
        }
    });

    // (선택 사항) 로컬 스토리지에 저장하여 페이지 새로고침 시 유지
    localStorage.setItem('selectedLanguage', isEnglish ? 'en' : 'ko');
});

// 페이지 로드 시 기존 설정 불러오기
window.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang === 'en') {
        langToggle.click(); // 저장된 언어가 영어라면 클릭 이벤트 강제 발생
    }
});