
import { parse, format } from 'date-fns';
import IBAN from 'iban';

export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export const formatIban = (iban) => {
  return iban ? IBAN.printFormat(iban) : "";
}

export const formatEuro = (amount, hasEuroSign = false) => {
  if (!amount) return '';
  if (hasEuroSign) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  return new Intl.NumberFormat('de-DE').format(amount);
}

export const formatEuroForApi = (amount) => {
  return Number(String(amount).replace('.', '').replace(',', '.'));
}

export const parseGermanDate = (date) => {
  return parse(date, 'dd.MM.yyyy', new Date());
}

export const formatDate = (date) => {
  return Date.parse(date) ? format(Date.parse(date), 'dd.MM.yyyy') : ''
}

export const generateExcerpt = (text) => {
  return `${text.substring(0, 20)}${text.length > 20 ? "..." : ""}`;
}

export const togglePageScrolling = () => {
  const body = document.querySelector('body');
  body.classList.toggle('modal--open');
}