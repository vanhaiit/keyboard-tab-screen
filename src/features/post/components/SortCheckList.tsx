import { View } from 'react-native';
import React, { useState } from 'react';
import CheckBox from '@/components/CheckBox';
import styled from '@emotion/native';
import { scale } from '@/theme/helper';
import { useTheme } from '@emotion/react';
import { LargeLabel } from '@/components/Typography';

type SortType = {
  text: string;
  value: string;
};

const SORT_LIST: SortType[] = [
  {
    text: 'Following',
    value: '',
  },
  {
    text: 'All',
    value: '',
  },
  {
    text: 'Top',
    value: '',
  },
  {
    text: 'User',
    value: '',
  },
  {
    text: 'DAO',
    value: '',
  },
  {
    text: 'Latest',
    value: '',
  },
  {
    text: 'Trending',
    value: '',
  },
];

const ViewResultButton = styled.Pressable(
  ({ theme: { space, colors, borderRadius, styles } }) => ({
    ...styles.center,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.lightGreen,
    height: scale(50),
    width: '100%',
    marginVertical: space[6],
  }),
);

const SortCheckList = () => {
  const { colors } = useTheme();
  const [sortBy, setSortBy] = useState<SortType>();

  const handleOnChecked = (value: SortType) => {
    setSortBy(value);
  };

  return (
    <View>
      {SORT_LIST.map(item => (
        <CheckBox
          checked={sortBy?.text === item.text}
          label={item.text}
          onPress={() => handleOnChecked(item)}
        />
      ))}

      <ViewResultButton>
        <LargeLabel fontWeight="bold" color={colors.black[4]}>
          View results
        </LargeLabel>
      </ViewResultButton>
    </View>
  );
};

export default SortCheckList;
