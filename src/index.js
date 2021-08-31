import './sass/main.scss';
import countries from './template/country.hbs';
import country from './template/countries.hbs';
import debounce from 'lodash/debounce';
import { error, defaultModules } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import '@pnotify/core/dist/BrightTheme.css';

defaultModules.set(PNotifyMobile, {});

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const markup = document.querySelector('.markup-container');

function fetchCountry(searchQuery) {
    return fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
        .then(res => res.json())
        .catch(error => console.log(`${error}`));
}

input.addEventListener('input', debounce(searchCountries,500 ));
form.addEventListener('submit', event => { event.preventDefault() });

function searchCountries(e) {
    const searchQuery = e.target.value;
    clearInput();
    fetchCountry(searchQuery).then(updateCountries);
    markup.addEventListener('click', searchResult);
}

function searchResult(e) {
    input.value = e.target.textContent;
    clearInput();
    fetchCountry(input.value).then(updateCountries);
    input.value = '';
    markup.removeEventListener('click', searchResult);
}

function clearInput() {
    markup.innerHTML = '';
}

function updateCountries(data) {
    if (data.length === 1) {
        markup.insertAdjacentHTML('beforeend', country(data));
        return;
        }

    if (data.status === 404) {
        error({
        type: 'notice',
        text: 'Ничего не нашли, попробуй еще',
        delay: 2000,
        width: '300px',
        maxTextHeight: null,
    });
  }

  markup.insertAdjacentHTML('beforeend', countries(data));
}