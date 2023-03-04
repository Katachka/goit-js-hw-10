import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

// посилання
const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
// прослуховувач
const DEBOUNCE_DELAY = 300;
refs.searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
// пошук
function onInput(e) {
  const countryName = e.target.value.trim();
  console.log(e.target.value);
  if (!countryName) {
    clearMarkup();
    return;
  }
  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearMarkup();
        return;
      }

      if (countries.length >= 2 && countries.length <= 10) {
        const listMarkup = countries.map(country => listCountry(country));
        refs.countryList.innerHTML = listMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }
      if (countries.length === 1) {
        const markup = countries.map(country => cardCountry(country));
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = markup.join('');
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      clearMarkup();
      return error;
    });
}
// функція, яка очищує розмітку
function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

// розмітка списку країн
function listCountry({ flags, name }) {
  return `
  <li class="country-list__item">
  <img
    src="${flags.svg}"
    alt="${name.official}"
    width="50"
   height="40"
  />
  <h2 class="country-list__name">${name.official}</h2>
</li>`;
}
// розмітка картки країни
function cardCountry({ flags, name, capital, population, languages }) {
  return `
    <div class="country-info__container">
    <div class="country-info__wraper">
  <img
    src="${flags.svg}"
    alt="${name.official}"
    width="50" 
    height="40"
  />
  <h2>${name.official}</h2>
  </div>
  <p class="country-info__card"><span><b>Capital:</b></span>${capital}</p>
  <p class="country-info__card"><span><b>Population:</b></span>${population}</p>
  <p class="country-info__card">
    <span><b>Languages:</b></span>${Object.values(languages)}
  </p>
</div>`;
}
