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

getPos();
console.log(posArr);
window.addEventListener('resize', getPos);

window.addEventListener('scroll', () => {
  let scroll = window.scrollY || window.pageYOffset;
  parallex();

  // Dynamic Scroll Triggering for page sections
  pages.forEach((page, idx) => {
    if (idx === 0) return; // skip header

    let threshold = posArr[idx] - window.innerHeight * 0.85;

    // Adjust triggers slightly to feel identical to original design
    if (idx === 1) threshold = posArr[1] - window.innerHeight * 0.95; // Our company title
    if (idx === 2) threshold = posArr[2] - window.innerHeight * 0.9;  // Our company container

    if (scroll >= threshold) {
      page.classList.add('on');
    } else {
      page.classList.remove('on');
    }
  });

  // --- Intro Section Shrink & Text Fade-in Scroll Animation ---
  const introSection = document.querySelector('.intro');
  if (introSection) {
    const rect = introSection.getBoundingClientRect();
    const sectionHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const totalScrollable = sectionHeight - viewportHeight;

    // Scroll progress (0 to 1) inside .intro
    let progress = -rect.top / totalScrollable;
    progress = Math.max(0, Math.min(1, progress));

    // Shrinking phase runs from progress = 0 to progress = 0.7
    const animProgress = Math.max(0, Math.min(1, progress / 0.7));

    const finalWidth = 576;
    const finalHeight = 324;
    const containerWidth = 1280;
    const containerHeight = 324;

    const viewportWidth = window.innerWidth;

    const containerLeft = (viewportWidth - containerWidth) / 2;
    const containerTop = (viewportHeight - containerHeight) / 2;

    const startLeft = -containerLeft;
    const startTop = -379;
    const finalLeft = containerWidth - finalWidth; // 704
    const finalTop = 0;

    const article = introSection.querySelector('.intro__container article');
    const introDetail = introSection.querySelector('.intro-detail');
    const whiteLogo = introSection.querySelector('.white-logo');

    if (article) {
      // Interpolate dimensions and position relative to .intro__container
      const currentWidth = viewportWidth - (viewportWidth - finalWidth) * animProgress;
      const currentHeight = viewportHeight - (viewportHeight - finalHeight) * animProgress;
      const currentLeft = startLeft + (finalLeft - startLeft) * animProgress;
      const currentTop = startTop + (finalTop - startTop) * animProgress;
      const currentBorderRadius = 10 * animProgress;

      article.style.width = `${currentWidth}px`;
      article.style.height = `${currentHeight}px`;
      article.style.left = `${currentLeft}px`;
      article.style.top = `${currentTop}px`;
      article.style.borderRadius = `${currentBorderRadius}px`;

      // Set zIndex: cover on top when full screen, go down when shrunk
      if (animProgress < 0.9) {
        article.style.zIndex = '10';
      } else {
        article.style.zIndex = '3';
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

    if (whiteLogo) {
      // Logo fades in as image shrinks
      let logoProgress = 0;
      if (animProgress > 0.3) {
        logoProgress = (animProgress - 0.3) / 0.7;
      }
      whiteLogo.style.opacity = logoProgress;
    }
  }

  // Support section background color and text transitions
  const supportSection = document.querySelector('.support');
  if (supportSection && !supportSection.classList.contains('expanded')) {
    const supportTitle = supportSection.querySelector('.support__title-wrapper');
    const supportBtn = supportSection.querySelector('.support__container a');
    const rect = supportSection.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    let ratio = 0;
    if (rect.top > viewHeight) {
      ratio = 0;
    } else if (rect.top <= viewHeight && rect.bottom >= 0) {
      // Calculate how far the support section has entered the viewport
      ratio = 1 - (rect.top / viewHeight);
      ratio = Math.max(0, Math.min(1, ratio));
    } else {
      ratio = 1;
    }

    // 1. Overlay opacity: 1 (fully light #f2f2f2) to 0 (fully dark gradient)
    supportSection.style.setProperty('--overlay-opacity', 1 - ratio);

    // 2. Title and subtitle text color: black (0,0,0) to white (255,255,255)
    const textVal = Math.round(0 + (255 - 0) * ratio);
    if (supportTitle) {
      supportTitle.style.color = `rgb(${textVal}, ${textVal}, ${textVal})`;
    }

    // 3. Button transitions:
    // From transparent background, dark blue text (#252c66) and border (#252c66)
    // To white background, black text (#000000) and white border (#ffffff)
    const bgAlpha = ratio; // transparent (0) to white (1)
    const btnColorR = Math.round(37 + (0 - 37) * ratio);
    const btnColorG = Math.round(44 + (0 - 44) * ratio);
    const btnColorB = Math.round(102 + (0 - 102) * ratio);

    const btnBorderR = Math.round(37 + (255 - 37) * ratio);
    const btnBorderG = Math.round(44 + (255 - 44) * ratio);
    const btnBorderB = Math.round(102 + (255 - 102) * ratio);

    if (supportBtn) {
      supportBtn.style.backgroundColor = `rgba(255, 255, 255, ${bgAlpha})`;
      supportBtn.style.color = `rgb(${btnColorR}, ${btnColorG}, ${btnColorB})`;
      supportBtn.style.borderColor = `rgb(${btnBorderR}, ${btnBorderG}, ${btnBorderB})`;
    }
  }
})

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

function parallex() {
  const scroll = window.scrollY || window.pageYOffset;
  const scroll2 = scroll - (posArr[3] - 1000);
  if (scroll > (posArr[3] - 1020)) {
    h4.style.left = scroll2 + 'px';
    console.log(h4.style.left);
    //console.log(posArr[2]); 129
    //console.log(posArr[3]); 1683
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
