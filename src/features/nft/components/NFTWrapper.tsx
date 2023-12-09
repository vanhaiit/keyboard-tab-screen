import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { DecoratedPopos } from '../types';
import EmptyNFTList from './EmptyNftList';
import NFTItem from './NFTItem';
import NFTListSkeleton from './NftListSkeleton';

const Container = styled(View)(({ theme: { space } }) => ({
  flex: 1,
  paddingTop: space[1],
}));

const ListContainer = styled(View)(({ theme: {} }) => ({
  flex: 1,
}));

interface IListNFT {
  data: DecoratedPopos[];
  isWearable?: boolean;
}

const ListNFT = ({ data, isWearable }: IListNFT) => {
  const { space } = useTheme();

  const styles = useMemo(() => {
    return {
      paddingBottom: space[6],
    };
  }, [space]);

  return (
    <ListContainer>
      <FlatList
        contentContainerStyle={styles}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({
          item,
          index,
        }: {
          item: DecoratedPopos;
          index: number;
        }) => {
          return <NFTItem index={index} data={item} isWearable={isWearable} />;
        }}
      />
    </ListContainer>
  );
};

interface INFTWrapper {
  data: DecoratedPopos[];
  isLoading: boolean;
  isWearable?: boolean;
}

const NFTWrapper = ({ data, isLoading, isWearable }: INFTWrapper) => {
  return (
    <Container>
      {isLoading ? (
        <NFTListSkeleton />
      ) : data && data?.length > 0 ? (
        <ListNFT data={data} isWearable={isWearable} />
      ) : (
        <EmptyNFTList />
      )}
    </Container>
  );
};

export default NFTWrapper;
