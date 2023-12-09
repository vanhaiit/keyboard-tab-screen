import BigNumber from 'bignumber.js';

const MIN_NUMBER_DISPLAY = 0.0001;

// slice number and format locale us
const sliceDecimal = (
  number: number,
  decimal: number,
  locale?: string,
  trailDoubleZero?: boolean,
) => {
  function join(wholeNumber: string, decimals: string) {
    if (!decimals) return wholeNumber;
    return [wholeNumber, decimals].join('.');
  }
  const numberFormatted = new BigNumber(
    new BigNumber(number).toFixed(decimal),
  ).toString(10);

  // parseFloat in case 99.980000 --> 99.98
  let [wholeNumber, decimals] = numberFormatted.split('.');
  if (locale === 'US') {
    wholeNumber = Intl.NumberFormat('en-US').format(Number(wholeNumber));
  }

  if (decimals && parseInt(decimals) !== 0) {
    if (decimals.length > decimal) {
      decimals = decimals.substring(0, decimal);
    }
    return join(wholeNumber, decimals);
  }

  if (trailDoubleZero) return join(wholeNumber, '');

  return wholeNumber;
};

// format CRM1
const DECIMAL_PLACE_COMMON = 2;

const formatLargeNumber = (
  val: string,
  decimalPlace = DECIMAL_PLACE_COMMON,
  minNumber = MIN_NUMBER_DISPLAY,
): string => {
  const parsedVal = Number(val);
  if (isNaN(parsedVal)) return '';
  const TRILLION = 1000000000000;
  const BILLION = 1000000000;
  const MILLION = 1000000;
  const Kilo = 1000;

  if (parsedVal === 0) return '0';
  if (minNumber && parsedVal < minNumber) return `< ${minNumber}`;
  if (parsedVal >= TRILLION) {
    return sliceDecimal(parsedVal / TRILLION, decimalPlace, 'US', false) + 'T';
  }
  if (parsedVal >= BILLION) {
    return sliceDecimal(parsedVal / BILLION, decimalPlace, 'US', false) + 'B';
  }
  if (parsedVal >= MILLION) {
    return sliceDecimal(parsedVal / MILLION, decimalPlace, 'US', false) + 'M';
  }
  if (parsedVal >= Kilo) {
    return sliceDecimal(parsedVal / Kilo, decimalPlace, 'US', false) + 'K';
  }

  return sliceDecimal(parsedVal, decimalPlace, 'US', true);
};
export default formatLargeNumber;
