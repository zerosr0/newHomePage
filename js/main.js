// section - visual class 슬라이드
const visual = document.querySelector('#visual');
const slides = visual.querySelectorAll('.panel li');
const btns = visual.querySelectorAll('.btns li');
const iconPlay = visual.querySelector('.fa-circle-play');
const iconPause = visual.querySelector('.fa-circle-pause');

const len = slides.length - 1;
const interval = 4500;
let vsNum = 0;
let timer = null;

startRolling();

btns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    activation(idx);
    stopRolling();
  })
})

iconPlay.addEventListener('click', startRolling);
iconPause.addEventListener('click', stopRolling);

function activation(index) {
  for (const el of slides) el.classList.remove('on');
  for (const el of btns) el.classList.remove('on');
  slides[index].classList.add('on');
  btns[index].classList.add('on');
  vsNum = index;
}

function rolling() {
  vsNum < len ? vsNum++ : (vsNum = 0);
  activation(vsNum);
}

function startRolling() {
  activation(vsNum);
  timer = setInterval(rolling, interval);
  iconPause.classList.remove('on');
  iconPlay.classList.add('on');
}

function stopRolling() {
  clearInterval(timer);
  iconPause.classList.add('on');
  iconPlay.classList.remove('on');
}


//product scroll 
const pages = document.querySelectorAll('.page');
let h4 = document.querySelector('.intro h4');
let h5 = document.querySelector('.intro h5');
let posArr = [];

// Cache DOM queries for scroll animations
const introSection = document.querySelector('.intro');
const introArticle = introSection ? introSection.querySelector('.intro__container article') : null;
const introDetail = introSection ? introSection.querySelector('.intro-detail') : null;
const introWhiteLogo = introSection ? introSection.querySelector('.white-logo') : null;

const supportSection = document.querySelector('.support');
const supportTitle = supportSection ? supportSection.querySelector('.support__title-wrapper') : null;
const supportBtn = supportSection ? supportSection.querySelector('.support__container a') : null;

// Cache window dimensions and element metrics
let cachedWindowWidth = window.innerWidth;
let cachedWindowHeight = window.innerHeight;
let introOffsetTop = introSection ? getAbsoluteOffsetTop(introSection) : 0;
let introHeight = introSection ? introSection.offsetHeight : 0;
let supportOffsetTop = supportSection ? getAbsoluteOffsetTop(supportSection) : 0;
let supportHeight = supportSection ? supportSection.offsetHeight : 0;

function updateMetrics() {
  getPos();
  cachedWindowWidth = window.innerWidth;
  cachedWindowHeight = window.innerHeight;
  introOffsetTop = introSection ? getAbsoluteOffsetTop(introSection) : 0;
  introHeight = introSection ? introSection.offsetHeight : 0;
  supportOffsetTop = supportSection ? getAbsoluteOffsetTop(supportSection) : 0;
  supportHeight = supportSection ? supportSection.offsetHeight : 0;
}

updateMetrics();
console.log(posArr);
window.addEventListener('resize', updateMetrics);

// requestAnimationFrame Throttle
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

    // Adjust triggers slightly to feel identical to original design
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
    const rectTop = introOffsetTop - scroll;
    const totalScrollable = introHeight - cachedWindowHeight;

    // Scroll progress (0 to 1) inside .intro
    let progress = -rectTop / totalScrollable;
    progress = Math.max(0, Math.min(1, progress));

    // Shrinking phase runs from progress = 0 to progress = 0.7
    const animProgress = Math.max(0, Math.min(1, progress / 0.7));

    const finalWidth = 576;
    const finalHeight = 324;
    const containerWidth = 1280;
    const containerHeight = 324;

    const containerLeft = (cachedWindowWidth - containerWidth) / 2;
    const containerTop = (cachedWindowHeight - containerHeight) / 2;

    const startLeft = -containerLeft;
    const startTop = -379;
    const finalLeft = containerWidth - finalWidth; // 704
    const finalTop = 0;

    if (introArticle) {
      // Interpolate dimensions and position relative to .intro__container
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

      // Set zIndex: cover on top when full screen, go down when shrunk
      if (animProgress < 0.9) {
        introArticle.style.zIndex = '10';
      } else {
        introArticle.style.zIndex = '3';
      }
    }

    if (introDetail) {
      // Fade in and slide in from left as the image shrinks
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
      // Logo fades in as image shrinks
      let logoProgress = 0;
      if (animProgress > 0.3) {
        logoProgress = (animProgress - 0.3) / 0.7;
      }
      introWhiteLogo.style.opacity = logoProgress;
    }
  }


}

function getAbsoluteOffsetTop(element) {
  let top = 0;
  let curr = element;
  while (curr) {
    if (curr.classList.contains('intro-sticky-wrapper')) {
      top += curr.parentElement.offsetTop;
      curr = curr.parentElement.offsetParent;
      continue;
    }
    top += curr.offsetTop;
    curr = curr.offsetParent;
  }
  return top;
}

function getPos() {
  posArr = [];
  for (let el of pages) {
    posArr.push(getAbsoluteOffsetTop(el));
  }
}

function parallex(scroll) {
  const scroll2 = scroll - (posArr[3] - 1000);
  if (scroll > (posArr[3] - 1020)) {
    h4.style.left = scroll2 + 'px';
    h5.style.left = scroll2 * 1.7 + 'px';
  }
}

// --- News Section Slider ---
const newsFrame = document.querySelector('.news-frame');
const preBtn = document.querySelector('.news-btns .pre-btn');
const nextBtn = document.querySelector('.news-btns .next-btn');

let newsTimer = null;
const newsInterval = 5000; // 5 seconds

function startNewsRolling() {
  stopNewsRolling();
  newsTimer = setInterval(slideNext, newsInterval);
}

function stopNewsRolling() {
  if (newsTimer) {
    clearInterval(newsTimer);
    newsTimer = null;
  }
}

function slideNext() {
  if (!newsFrame) return;
  const firstArticle = newsFrame.querySelector('article');
  if (!firstArticle) return;

  const articleWidth = firstArticle.getBoundingClientRect().width;
  const gap = parseFloat(window.getComputedStyle(newsFrame).gap) || 0;
  const slideDistance = articleWidth + gap;

  new Anime(firstArticle, {
    prop: 'margin-left',
    value: -slideDistance,
    duration: 800,
    callback: () => {
      firstArticle.style['margin-left'] = '0px';
      newsFrame.appendChild(firstArticle);
    }
  });
}

function slidePrev() {
  if (!newsFrame) return;
  const articles = newsFrame.querySelectorAll('article');
  if (articles.length === 0) return;
  const lastArticle = articles[articles.length - 1];

  const articleWidth = lastArticle.getBoundingClientRect().width;
  const gap = parseFloat(window.getComputedStyle(newsFrame).gap) || 0;
  const slideDistance = articleWidth + gap;

  lastArticle.style['margin-left'] = `-${slideDistance}px`;
  newsFrame.insertBefore(lastArticle, newsFrame.firstChild);

  new Anime(lastArticle, {
    prop: 'margin-left',
    value: 0,
    duration: 800,
    callback: () => {
      lastArticle.style['margin-left'] = '0px';
    }
  });
}

if (newsFrame) {
  startNewsRolling();

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      slideNext();
      startNewsRolling(); // Reset interval
    });
  }

  if (preBtn) {
    preBtn.addEventListener('click', () => {
      slidePrev();
      startNewsRolling(); // Reset interval
    });
  }
}

// --- Support Section Form Toggle ---
const inquiryBtn = document.getElementById('inquiry-btn');
const supportSec = document.querySelector('.support');
const initialContent = document.querySelector('.support__container.initial-content');
const expandedContent = document.querySelector('.support__container.expanded-content');

if (inquiryBtn && supportSec && initialContent && expandedContent) {
  inquiryBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Fade out initial content
    initialContent.style.transition = 'opacity 0.3s ease';
    initialContent.style.opacity = '0';

    setTimeout(() => {
      initialContent.style.display = 'none';

      // Expand the support section height
      supportSec.classList.add('expanded');

      // Show and fade in expanded content
      expandedContent.style.display = 'flex';
      expandedContent.style.opacity = '0';
      expandedContent.style.transition = 'opacity 0.5s ease 0.2s';

      // Force layout reflow
      void expandedContent.offsetHeight;

      expandedContent.style.opacity = '1';
    }, 300);
  });
}

function initSplitText() {
  const splitTargets = document.querySelectorAll('.split-text');
  splitTargets.forEach(target => {
    let charIndex = 0;
    
    function splitNode(node, parentNode) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        const fragment = document.createDocumentFragment();
        
        // 공백을 포함하여 단어로 분리
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
