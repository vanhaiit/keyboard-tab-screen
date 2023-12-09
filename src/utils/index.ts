import { Dimensions } from 'react-native';

export const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } =
  Dimensions.get('window');

export const isValidURL = (url: string) => {
  const urlRegex =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  if (url.match(urlRegex) === null) {
    return false;
  } else {
    return true;
  }
};

export const formatEllipsisMiddle = (
  account: string,
  beginning: number,
  final: number,
) => {
  return account && account.length > 6
    ? account.slice(0, beginning) + '...' + account.slice(-final)
    : account;
};
