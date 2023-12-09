import styled from '@emotion/native';
import { useCallback } from 'react';
import { View, FlatList } from 'react-native/';
import NFTSkeleton from './NFTSkeleton';

const Separator = styled(View)(({ theme: { space } }) => ({
  marginBottom: space[2],
}));

const data = [1, 2, 3, 4, 5, 6];

const NFTListSkeleton = () => {
  const renderSeparator = useCallback(() => <Separator />, []);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={renderSeparator}
      data={data}
      keyExtractor={item => item.toString()}
      numColumns={2}
      renderItem={() => {
        return <NFTSkeleton />;
      }}
    />
  );
};
export default NFTListSkeleton;
