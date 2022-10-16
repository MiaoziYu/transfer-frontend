
import { parse } from 'date-fns';
export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export const parseGermanDate = (date) => {
  return parse(date, 'dd.MM.yyyy', new Date());
}

export const toogleBackground = () => {
  const body = document.querySelector('body');
  body.classList.toggle('modal--open');
}