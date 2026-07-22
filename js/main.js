// section - visual class 슬라이드
const visual = document.querySelector('#visual');
const slides = visual ? visual.querySelectorAll('.panel li') : [];
const btns = visual ? visual.querySelectorAll('.btns li') : [];
const iconPlay = visual ? visual.querySelector('.fa-circle-play') : null;
const iconPause = visual ? visual.querySelector('.fa-circle-pause') : null;

const len = slides.length - 1;
const interval = 5500;
let vsNum = 0;
let timer = null;

if (slides.length > 0) {
  startRolling();
}

btns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    activation(idx);
    stopRolling();
  });
});

if (iconPlay) iconPlay.addEventListener('click', startRolling);
if (iconPause) iconPause.addEventListener('click', stopRolling);

function activation(index) {
  for (const el of slides) el.classList.remove('on');
  for (const el of btns) el.classList.remove('on');
  if (slides[index]) slides[index].classList.add('on');
  if (btns[index]) btns[index].classList.add('on');
  vsNum = index;
}

function rolling() {
  vsNum < len ? vsNum++ : (vsNum = 0);
  activation(vsNum);
}

function startRolling() {
  activation(vsNum);
  if (timer) clearInterval(timer);
  timer = setInterval(rolling, interval);
  if (iconPause) iconPause.classList.remove('on');
  if (iconPlay) iconPlay.classList.add('on');
}

function stopRolling() {
  if (timer) clearInterval(timer);
  if (iconPause) iconPause.classList.add('on');
  if (iconPlay) iconPlay.classList.remove('on');
}

// --- Helper Functions ---
function getAbsoluteOffsetTop(element) {
  let top = 0;
  let curr = element;
  while (curr) {
    if (curr.classList && curr.classList.contains('intro-sticky-wrapper')) {
      top += curr.parentElement.offsetTop;
      curr = curr.parentElement.offsetParent;
      continue;
    }
    top += curr.offsetTop;
    curr = curr.offsetParent;
  }
  return top;
}

// Product & Page Scroll Setup
const pages = document.querySelectorAll('.page');
let h4 = document.querySelector('.intro h4');
let h5 = document.querySelector('.intro h5');
let posArr = [];

function getPos() {
  posArr = [];
  for (let el of pages) {
    posArr.push(getAbsoluteOffsetTop(el));
  }
}

function parallex(scroll) {
  if (posArr.length > 3 && h4 && h5) {
    const scroll2 = scroll - (posArr[3] - 1000);
    if (scroll > (posArr[3] - 1020)) {
      h4.style.left = scroll2 + 'px';
      h5.style.left = scroll2 * 1.7 + 'px';
    }
  }
}

// Cache DOM queries for scroll animations
const introSection = document.querySelector('.intro');
const introArticle = introSection ? introSection.querySelector('.intro__container article') : null;
const introDetail = introSection ? introSection.querySelector('.intro-detail') : null;
const introWhiteLogo = introSection ? introSection.querySelector('.white-logo') : null;

// Cache window dimensions and element metrics
let cachedWindowWidth = window.innerWidth;
let cachedWindowHeight = window.innerHeight;
let introOffsetTop = introSection ? getAbsoluteOffsetTop(introSection) : 0;
let introHeight = introSection ? introSection.offsetHeight : 0;

function updateMetrics() {
  getPos();
  cachedWindowWidth = window.innerWidth;
  cachedWindowHeight = window.innerHeight;
  introOffsetTop = introSection ? getAbsoluteOffsetTop(introSection) : 0;
  introHeight = introSection ? introSection.offsetHeight : 0;
}

updateMetrics();
window.addEventListener('resize', updateMetrics);

// requestAnimationFrame Throttle Scroll Listener
let lastScrollY = window.scrollY || window.pageYOffset;
let isTicking = false;

window.addEventListener('scroll', () => {
  lastScrollY = window.scrollY || window.pageYOffset;
  if (!isTicking) {
    window.requestAnimationFrame(() => {
      updateScrollAnimations(lastScrollY);
      isTicking = false;
    });
    isTicking = true;
  }
});

function updateScrollAnimations(scroll) {
  // Parallex
  parallex(scroll);

  // Dynamic Scroll Triggering for page sections
  pages.forEach((page, idx) => {
    if (idx === 0) return; // skip header

    let threshold = posArr[idx] - cachedWindowHeight * 0.85;

    if (idx === 1) threshold = posArr[1] - cachedWindowHeight * 0.95; // Our company title
    if (idx === 2) threshold = posArr[2] - cachedWindowHeight * 0.9;  // Our company container

    if (scroll >= threshold) {
      page.classList.add('on');
    } else {
      page.classList.remove('on');
    }
  });

  // --- Intro Section Shrink & Text Fade-in Scroll Animation ---
  if (introSection) {
    if (cachedWindowWidth <= 1000) {
      // 모바일 해상도에서는 복잡한 스크롤 애니메이션 인라인 스타일을 초기화하여 CSS 정적 레이아웃이 적용되게 함
      if (introArticle) {
        introArticle.style.width = '';
        introArticle.style.height = '';
        introArticle.style.left = '';
        introArticle.style.top = '';
        introArticle.style.borderRadius = '';
        introArticle.style.zIndex = '';
      }
      if (introDetail) {
        introDetail.style.opacity = '';
        introDetail.style.transform = '';
        introDetail.style.pointerEvents = '';
      }
      if (introWhiteLogo) {
        introWhiteLogo.style.opacity = '';
      }
    } else {
      const rectTop = introOffsetTop - scroll;
      const totalScrollable = introHeight - cachedWindowHeight;

      let progress = -rectTop / totalScrollable;
      progress = Math.max(0, Math.min(1, progress));

      const animProgress = Math.max(0, Math.min(1, progress / 0.7));

      const finalWidth = 576;
      const finalHeight = 324;
      const containerWidth = 1280;
      const containerHeight = 324;

      const containerLeft = (cachedWindowWidth - containerWidth) / 2;
      const containerTop = (cachedWindowHeight - containerHeight) / 2;

      const startLeft = -containerLeft;
      const startTop = -379;
      const finalLeft = containerWidth - finalWidth;
      const finalTop = 0;

      if (introArticle) {
        const currentWidth = cachedWindowWidth - (cachedWindowWidth - finalWidth) * animProgress;
        const currentHeight = cachedWindowHeight - (cachedWindowHeight - finalHeight) * animProgress;
        const currentLeft = startLeft + (finalLeft - startLeft) * animProgress;
        const currentTop = startTop + (finalTop - startTop) * animProgress;
        const currentBorderRadius = 10 * animProgress;

        introArticle.style.width = `${currentWidth}px`;
        introArticle.style.height = `${currentHeight}px`;
        introArticle.style.left = `${currentLeft}px`;
        introArticle.style.top = `${currentTop}px`;
        introArticle.style.borderRadius = `${currentBorderRadius}px`;

        if (animProgress < 0.9) {
          introArticle.style.zIndex = '10';
        } else {
          introArticle.style.zIndex = '3';
        }
      }

      if (introDetail) {
        let textProgress = 0;
        if (animProgress > 0.3) {
          textProgress = (animProgress - 0.3) / 0.7;
        }
        introDetail.style.opacity = textProgress;
        introDetail.style.transform = `translateX(${-50 * (1 - textProgress)}px)`;
        if (textProgress > 0.01) {
          introDetail.style.pointerEvents = 'auto';
        } else {
          introDetail.style.pointerEvents = 'none';
        }
      }

      if (introWhiteLogo) {
        let logoProgress = 0;
        if (animProgress > 0.3) {
          logoProgress = (animProgress - 0.3) / 0.7;
        }
        introWhiteLogo.style.opacity = logoProgress;
      }
    }
  }
}

let purpleScrollTrigger;

// --- Unified GSAP ScrollTrigger for Service Card & Support Section (.service + .support) ---
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const serviceSec = document.querySelector('.service');
  const supportSec = document.querySelector('.support.solva-pinned-purple');

  if (serviceSec && supportSec) {
    purpleScrollTrigger = ScrollTrigger.create({
      trigger: serviceSec,
      endTrigger: supportSec,
      start: "top center",   // .service 카드가 화면 중앙에 올 때 통합 다크 배경 시작
      end: "bottom 30%",     // .support 하단이 화면 30% 지점 지날 때 원래 흰색 배경으로 복귀
      onToggle: (self) => {
        // body 다크 배경 토글 (통배경 유지)
        document.body.classList.toggle('dark-background', self.isActive);

        // service 카드의 수직 애니메이션
        const serviceWrapper = document.querySelector('.service .service-wrapper');
        if (serviceWrapper) {
          serviceWrapper.classList.toggle('on', self.isActive);
        }

        // support 섹션도 일체감 있게 텍스트/버튼 색상 활성화
        if (!supportSec.classList.contains('expanded')) {
          supportSec.classList.toggle('purple-active', self.isActive);
        }
      }
    });
  }

  if (typeof updateMetrics === 'function') {
    ScrollTrigger.addEventListener("refresh", updateMetrics);
  }
}

  // --- Support Section Form Toggle ---
  const inquiryBtn = document.getElementById('inquiry-btn');
  const supportSec = document.querySelector('.support.solva-pinned-purple');
  const initialContent = document.querySelector('.support__container.initial-content');
  const expandedContent = document.querySelector('.support__container.expanded-content');

  if (inquiryBtn && supportSec && initialContent && expandedContent) {
    inquiryBtn.addEventListener('click', (e) => {
      e.preventDefault();

      if (purpleScrollTrigger) {
        purpleScrollTrigger.kill();
        purpleScrollTrigger = null;
      }
      ScrollTrigger.refresh();

      supportSec.style.position = '';
      supportSec.style.top = '';
      supportSec.style.left = '';
      supportSec.style.width = '';
      supportSec.style.height = '';
      supportSec.style.transform = '';

      initialContent.style.transition = 'opacity 0.3s ease';
      initialContent.style.opacity = '0';

      setTimeout(() => {
        initialContent.style.display = 'none';
        supportSec.classList.add('expanded');

        expandedContent.style.display = 'flex';
        expandedContent.style.opacity = '0';
        expandedContent.style.transition = 'opacity 0.5s ease 0.2s';

        void expandedContent.offsetHeight;

        expandedContent.style.opacity = '1';
      }, 300);
    });
  }

// --- News Section Slider ---
const newsFrame = document.querySelector('.news-frame');
const preBtn = document.querySelector('.news-btns .pre-btn');
const nextBtn = document.querySelector('.news-btns .next-btn');

let newsTimer = null;
const newsInterval = 5000;

function startNewsRolling() {
  stopNewsRolling();
  newsTimer = setInterval(slideNext, newsInterval);
}

function stopNewsRolling() {
  if (newsTimer) clearInterval(newsTimer);
}

function slideNext() {
  if (newsFrame) {
    const firstChild = newsFrame.firstElementChild;
    if (firstChild) {
      newsFrame.appendChild(firstChild);
    }
  }
}

function slidePrev() {
  if (newsFrame) {
    const lastChild = newsFrame.lastElementChild;
    if (lastChild) {
      newsFrame.insertBefore(lastChild, newsFrame.firstElementChild);
    }
  }
}

if (newsFrame) {
  startNewsRolling();

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slideNext();
      startNewsRolling();
    });
  }

  if (preBtn) {
    preBtn.addEventListener('click', () => {
      slidePrev();
      startNewsRolling();
    });
  }
}

// --- Split Text Character Animation ---
function initSplitText() {
  const splitTargets = document.querySelectorAll('.split-text');
  splitTargets.forEach(target => {
    let charIndex = 0;

    function splitNode(node, parentNode) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const fragment = document.createDocumentFragment();

        const words = text.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim() === '') {
            const space = document.createElement('span');
            space.className = 'whitespace';
            space.innerHTML = word.replace(/ /g, '&nbsp;');
            fragment.appendChild(space);
          } else {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';

            for (let char of word) {
              const charSpan = document.createElement('span');
              charSpan.className = 'char';
              charSpan.textContent = char;
              charSpan.style.animationDelay = `${0.1 + charIndex * 0.05}s`;
              wordSpan.appendChild(charSpan);
              charIndex++;
            }
            fragment.appendChild(wordSpan);
          }
        });
        parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const children = Array.from(node.childNodes);
        children.forEach(child => splitNode(child, node));
      }
    }

    const initialChildren = Array.from(target.childNodes);
    initialChildren.forEach(child => splitNode(child, target));
  });
}

initSplitText();

// 모바일 햄버거 메뉴 토글 로직 추가
(function() {
  const mMenuBtn = document.querySelector('#m-menu-btn');
  const gnb = document.querySelector('#gnb');
  const header = document.querySelector('header');

  if (mMenuBtn && gnb) {
    mMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      gnb.classList.toggle('on');
      mMenuBtn.classList.toggle('on');
      if (header) header.classList.toggle('on');
      
      // FontAwesome 아이콘 변경 (삼선 <-> X표시)
      const icon = mMenuBtn.querySelector('i');
      if (icon) {
        if (gnb.classList.contains('on')) {
          icon.className = 'fa-solid fa-xmark';
        } else {
          icon.className = 'fa-solid fa-bars';
        }
      }
    });

    // 메뉴판 바깥 영역 터치/클릭 시 닫기
    document.addEventListener('click', function(e) {
      if (gnb.classList.contains('on') && !gnb.contains(e.target) && !mMenuBtn.contains(e.target)) {
        gnb.classList.remove('on');
        mMenuBtn.classList.remove('on');
        if (header) header.classList.remove('on');
        const icon = mMenuBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }
})();
