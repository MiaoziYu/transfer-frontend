import { parse, format, formatISO } from 'date-fns';
import IBAN from 'iban';

const parseGermanDate = (date) => {
  return parse(date, 'dd.MM.yyyy', new Date());
};

const formatDate = (date) => {
  return Date.parse(date) ? format(Date.parse(date), 'dd.MM.yyyy') : ''
};

const formatDateForApi = (date) => {
  return formatISO(parseGermanDate(date));
};

const formatAmount = (amount, hasEuroSign = false) => {
  if (!amount) return '';
  if (hasEuroSign) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  return new Intl.NumberFormat('de-DE').format(amount);
};

const formatAmountForApi = (amount) => {
  return Number(amount.replaceAll('.', '').replace(',', '.'));
};

const formatIban = (iban) => {
  return iban ? IBAN.printFormat(iban) : "";
};

const formatIbanForApi = (iban) => {
  return IBAN.electronicFormat(iban);
};

const formatAsExcerpt = (text, length = 20) => {
  return `${text.substring(0, length)}${text.length > length ? "..." : ""}`;
};

const formatter = {
  parseGermanDate,
  formatDate,
  formatDateForApi,
  formatAmount,
  formatAmountForApi,
  formatIban,
  formatIbanForApi,
  formatAsExcerpt,
};

export default formatter;
