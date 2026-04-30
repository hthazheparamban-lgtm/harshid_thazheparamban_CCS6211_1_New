'use strict';

/* 
   SMOOTH SCROLL
 */
const btnScrollTo = document.querySelector('.btn--scroll-to');
const weatherSection = document.querySelector('#weather-section');

btnScrollTo?.addEventListener('click', () => {
  weatherSection.scrollIntoView({ behavior: 'smooth' });
});
/*  DATA */
const cities = [
  { name: "New York", lat: 40.7128, lon: -74.0060 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", lat: 35.6895, lon: 139.6917 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Cairo", lat: 30.0444, lon: 31.2357 }
];
/* DOM ELEMENTS. */
const grid = document.querySelector('#weather-grid');
const climateCards = document.querySelectorAll('.climate-card');
/*
  SKELETON LOADING Ui */
function renderSkeleton() {
  grid.innerHTML = '';

  cities.forEach(city => {
    const skeleton = document.createElement('article');
    skeleton.className = 'weather-card skeleton';

    skeleton.innerHTML = `
      <div class="weather-video skeleton-box"></div>
      <div class="weather-info">
        <h4>${city.name}</h4>
        <p>Loading...</p>
        <p>Fetching data...</p>
      </div>
    `;

    grid.appendChild(skeleton);
  });
}
