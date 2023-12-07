// section - visual class 슬라이드
const visual = document.querySelector('#visual');
const slides = visual.querySelectorAll('.panel li');
const btns = visual.querySelectorAll('.btns li');
const iconPlay = visual.querySelector('.fa-circle-play');
const iconPause = visual.querySelector('.fa-circle-pause');
const bar = visual.querySelector('.bar');

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
  bar.style.width = '0%';
}

function rolling() {
  vsNum < len ? vsNum++ : (vsNum = 0);
  activation(vsNum);
  progress();
}

function startRolling() {
  bar.style.display = 'block';
  setTimeout(progress, 0);
  activation(vsNum);
  timer = setInterval(rolling, interval);
  iconPause.classList.remove('on');
  iconPlay.classList.add('on');
}

function stopRolling() {
  bar.style.display = 'none';
  clearInterval(timer);
  iconPause.classList.add('on');
  iconPlay.classList.remove('on');
}

function progress() {
  new Anime(bar, {
    prop: 'width',
    value: '100%',
    duration: interval,
  })
}

//product scroll 
const pages = document.querySelectorAll('.page');
let h4 = document.querySelector('.intro .intro-container h4');
const h5 = document.querySelector('.intro .intro-container h5');
let posArr = [];

getPos();
console.log(posArr);
window.addEventListener('resize', getPos);



window.addEventListener('scroll', () => {
  let scroll = window.scrollY || window.pageYOffset;
  //parallex();
  console.log(scroll);


  // [0, 1030, 1159, 1633, 0, 370, 740, 1110]
  //posArr[0] : header
  //posArr[1] : our company title
  if (scroll >= 200) {
    pages[1].classList.add('on');
  } else {
    pages[1].classList.remove('on');
  }
  //posArr[2] : our company container
  if (scroll >= 500) {
    pages[2].classList.add('on');
  } else {
    pages[2].classList.remove('on');
  }
  //posArr[3] : our product title
  if (scroll >= 900) {
    pages[3].classList.add('on');
  } else {
    pages[3].classList.remove('on');
  }
  //posArr[4] : qms
  if (scroll >= 1200) {
    pages[4].classList.add('on');
  } else {
    pages[4].classList.remove('on');
  }
  //posArr[5] : mes
  if (scroll >= 1500) {
    pages[5].classList.add('on');
  } else {
    pages[5].classList.remove('on');
  }
  //posArr[6] : spc
  if (scroll >= 1750) {
    pages[6].classList.add('on');
  } else {
    pages[6].classList.remove('on');
  }
  //posArr[7] : smart-factory
  if (scroll >= 2050) {
    pages[7].classList.add('on');
  } else {
    pages[7].classList.remove('on');
  }
})


function getPos() {
  for (let el of pages) {
    posArr.push(el.offsetTop);
    console.log(el.length);
  }
}

// function parallex() {
//   const scroll = window.scrollY || window.pageYOffset;
//   const scroll2 = scroll - (posArr[3]);
//   //8/21(월) 이거 수정하기!!!!!!!!!!!!!!!!
//   if (scroll > posArr[3]) {
//     h4.style.left = scroll2 + 'px';
//     console.log(h4.style.left);
//     h5.style.left = scroll2 * 2 + 'px';
//   }
// }