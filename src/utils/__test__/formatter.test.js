import formatter from "../formatter";

describe('Formatter', () => {
  it('should format to german date', async () => {
    expect(formatter.formatDate('2022-10-11T00:00:00.000Z')).toBe('11.10.2022');
    expect(formatter.formatDate('a')).toBe('');
  });

  it('should format date for api', async () => {
    expect(formatter.formatDateForApi('11.10.2022')).toBe('2022-10-11T00:00:00+02:00');
  });

  it('should format Euro currency', async () => {
    expect(formatter.formatAmount('')).toBe('');
    expect(formatter.formatAmount('100')).toBe('100');
    expect(formatter.formatAmount('100', true)).toBe('100,00 €');
    expect(formatter.formatAmount('1000', true)).toBe('1.000,00 €');
    expect(formatter.formatAmount('1000000', true)).toBe('1.000.000,00 €');
  });

  it('should format Euro currency to number', async () => {
    expect(formatter.formatAmountForApi('100,00')).toBe(100);
    expect(formatter.formatAmountForApi('100,11')).toBe(100.11);
    expect(formatter.formatAmountForApi('1.000,00')).toBe(1000);
    expect(formatter.formatAmountForApi('1.000')).toBe(1000);
    expect(formatter.formatAmountForApi('1.000.000,00')).toBe(1000000);
  });

  it('should format IBAN', async () => {
    expect(formatter.formatIban('')).toBe('');
    expect(formatter.formatIban('DE75512108001245126199')).toBe('DE75 5121 0800 1245 1261 99');
  });

  it('should format IBAN for api', async () => {
    expect(formatter.formatIbanForApi('DE75 5121 0800 1245 1261 99')).toBe('DE75512108001245126199');
  });

  it('should format text as excerpt', async () => {
    expect(formatter.formatAsExcerpt('Lorem ipsum dolor sit amet, consectetur adipiscing elit'))
      .toBe('Lorem ipsum dolor si...');
    expect(formatter.formatAsExcerpt('Lorem ipsum dolor')) .toBe('Lorem ipsum dolor');
    expect(formatter.formatAsExcerpt('')) .toBe('');
  });
});