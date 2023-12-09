import dayjs from 'dayjs';

export const formatDate = (value: string, separator: string) => {
  let date = new Date(value);
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  let year = date.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [day, month, year].join(separator);
};

export const fromNow = (date: Date) => {
  const timeDiff = dayjs().diff(dayjs(date), 'days', true);
  if (timeDiff <= 2) {
    return dayjs(date).fromNow(false);
  } else {
    return formatDate(date.toString(), '/');
  }
};
