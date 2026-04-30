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

const weatherMap = {
  0: { desc: "Clear", video: "clear.mp4" },
  1: { desc: "Mainly Clear", video: "sunny.mp4" },
  2: { desc: "Partly Cloudy", video: "partly-cloudy.mp4" },
  3: { desc: "Overcast", video: "cloudy.mp4" },
  61: { desc: "Rain", video: "rain.mp4" },
  63: { desc: "Rain", video: "rain.mp4" },
  65: { desc: "Heavy Rain", video: "rain.mp4" },
  71: { desc: "Snow", video: "snow.mp4" }
};

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

/* 
   CREATE REAL CARD
 */
function createCard(city) {
  const card = document.createElement('article');
  card.className = 'weather-card';

  card.innerHTML = `
    <video class="weather-video" muted loop playsinline></video>
    <div class="weather-info">
      <h4 class="weather-city">${city.name}</h4>
      <p class="weather-temp">--</p>
      <p class="weather-desc">Loading...</p>
    </div>
  `;

  grid.appendChild(card);
  return card;
}

/*. UPDATE CARD. */
function updateCard(card, temp, info) {
  card.querySelector('.weather-temp').textContent = `${temp} °C`;
  card.querySelector('.weather-desc').textContent = info.desc;

  const video = card.querySelector('video');
  if (video) {
    video.src = `videos/${info.video}`;
    video.load();
    video.play().catch(() => {});
  }

  card.classList.add('show');
}

/*
   ERROR HANDLING */
function setError(card) {
  card.querySelector('.weather-temp').textContent = "N/A";
  card.querySelector('.weather-desc').textContent = "Data unavailable";
  card.classList.add('error');
}

/*
  \\ WEATHER FETCH   \\*/
async function loadWeather() {
  try {
    renderSkeleton();

    const responses = await Promise.all(
      cities.map(city =>
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
        )
      )
    );

    const data = await Promise.all(responses.map(res => res.json()));

    grid.innerHTML = '';

    data.forEach((weatherData, i) => {
      const city = cities[i];
      const card = createCard(city);

      const weather = weatherData?.current_weather;

      if (!weather) {
        setError(card);
        return;
      }

      const temp = weather.temperature;
      const code = weather.weathercode;
      const info = weatherMap[code] || {
        desc: "Unknown",
        video: "sunny.mp4"
      };

      updateCard(card, temp, info);
    });

  } catch (err) {
    console.error(err);
    grid.innerHTML = "<p class='error'>Failed to load weather data</p>";
  }
}

/* CLIMATE ZONE LAZY LOADING */
const climateObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const card = entry.target;
    const video = card.querySelector('.climate-video');

    if (video) {
      const src = video.dataset.src;

      if (src && !video.src) {
        video.src = src;
        video.load();
        video.play().catch(() => {});
      }
    }

    card.classList.add('show');
    observer.unobserve(card);
  });
}, {
  threshold: 0.2
});

climateCards.forEach(card => climateObserver.observe(card));

loadWeather();