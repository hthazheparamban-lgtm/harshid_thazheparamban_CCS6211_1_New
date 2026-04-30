'use strict';

/* 
   SMOOTH SCROLL
 */
const btnScrollTo = document.querySelector('.btn--scroll-to');
const weatherSection = document.querySelector('#weather-section');

btnScrollTo?.addEventListener('click', () => {
  weatherSection.scrollIntoView({ behavior: 'smooth' });
});
