export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export const togglePageScrolling = () => {
  const body = document.querySelector('body');
  body.classList.toggle('modal--open');
}