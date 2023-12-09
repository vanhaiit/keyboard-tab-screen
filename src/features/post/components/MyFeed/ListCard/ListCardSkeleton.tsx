import styled from '@emotion/native';
import { useCallback } from 'react';
import { FlatList } from 'react-native/';
import CardSkeleton from './CardSkeleton';
const Separator = styled.View(({ theme: { space } }) => ({
  height: space[5],
}));

const data = [1, 2, 3, 4, 5, 6, 7, 8];

const ListCardSkeleton = () => {
  const renderSeparator = useCallback(() => <Separator />, []);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={renderSeparator}
      data={data}
      keyExtractor={item => item.toString()}
      renderItem={() => {
        return <CardSkeleton mode="Post" />;
      }}
    />
  );
};
export default ListCardSkeleton;
