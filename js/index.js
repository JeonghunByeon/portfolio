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

function reserveLangWidths() {
    langElements.forEach(el => {
        const ko = el.getAttribute('data-ko') || el.textContent || '';
        const en = el.getAttribute('data-en') || el.textContent || '';
        const meas = document.createElement('span');
        meas.style.visibility = 'hidden';
        meas.style.position = 'absolute';
        meas.style.whiteSpace = 'nowrap';
        meas.style.font = window.getComputedStyle(el).font;
        meas.textContent = ko;
        document.body.appendChild(meas);
        const w1 = meas.offsetWidth;
        meas.textContent = en;
        const w2 = meas.offsetWidth;
        document.body.removeChild(meas);
        const max = Math.max(w1, w2);
        el.style.display = 'inline-block';
        // prevent reserved width from exceeding parent container (avoid pushing layout)
        const parentW = el.parentElement ? el.parentElement.offsetWidth : el.offsetWidth;
        const allowed = Math.max( Math.floor(parentW * 0.9), 40 );
        const final = Math.min(Math.ceil(max), allowed);
        el.style.minWidth = final + 'px';
    });
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        langToggle.classList.toggle('en-active');
        const isEnglish = langToggle.classList.contains('en-active');
        langToggle.setAttribute('aria-pressed', isEnglish ? 'true' : 'false');
        document.body.classList.toggle('lang-en', isEnglish);

        langElements.forEach(el => {
            if (isEnglish) {
                const enText = el.getAttribute('data-en');
                if (enText !== null) el.textContent = enText;
            } else {
                const koText = el.getAttribute('data-ko');
                if (koText !== null) el.textContent = koText;
            }
        });

        localStorage.setItem('selectedLanguage', isEnglish ? 'en' : 'ko');
    });

    // keyboard access (space/enter)
    langToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            langToggle.click();
        }
    });
}

// 페이지 로드 시 초기화: 너비 고정 -> 저장된 언어 적용
window.addEventListener('DOMContentLoaded', () => {
    reserveLangWidths();
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang === 'en' && langToggle && !langToggle.classList.contains('en-active')) {
        langToggle.classList.add('en-active');
        langToggle.setAttribute('aria-pressed', 'true');
        document.body.classList.add('lang-en');
    }
    // apply texts according to saved language
    const isEnglish = document.body.classList.contains('lang-en');
    langElements.forEach(el => {
        const text = isEnglish ? el.getAttribute('data-en') : el.getAttribute('data-ko');
        if (text !== null) el.textContent = text;
    });
});

// recompute min-widths on resize (debounced)
let _rt;
window.addEventListener('resize', () => {
    clearTimeout(_rt);
    _rt = setTimeout(reserveLangWidths, 120);
});