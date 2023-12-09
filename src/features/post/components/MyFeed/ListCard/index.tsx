import { DAO, UserProfile } from '@/features/profile/types';
import { WINDOW_HEIGHT } from '@/utils';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import ListCardSkeleton from './ListCardSkeleton';

interface ItemProps {
  item: any;
  isLoading: boolean;
}

interface Props {
  data: UserProfile[] | DAO[];
  onLoadMore?: () => void;
  loading?: boolean;
  ItemComponent: (props: ItemProps) => JSX.Element;
}

const SkeletonContainer = styled.View(() => ({
  minHeight: WINDOW_HEIGHT,
  flex: 1,
}));
const ListContainer = styled.View(({ theme: { space } }) => ({
  minHeight: WINDOW_HEIGHT - space[14] - space[10] - space[20],
  flex: 1,
}));

const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));

const ListCard = ({ data, loading, onLoadMore, ItemComponent }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { space } = useTheme();

  const onFlashListLoaded = useCallback(() => {
    setIsLoaded(true);
  }, [setIsLoaded]);

  const styles = useMemo(() => {
    return {
      paddingTop: space[3],
      paddingBottom: space[6],
    };
  }, [space]);

  const LoadingIcon = useMemo(() => {
    return (
      <>
        {loading ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color="#ffff" />
          </LoadingContainer>
        ) : (
          <></>
        )}
      </>
    );
  }, [loading]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<DAO | UserProfile>) => {
      return <ItemComponent item={item} isLoading={false} />;
    },
    [ItemComponent],
  );

  const keyExtractor = useCallback(
    (item: DAO | UserProfile, index: number) => item.id.toString() + index,
    [],
  );

  return (
    <>
      {!isLoaded && (
        <SkeletonContainer>
          <ListCardSkeleton />
        </SkeletonContainer>
      )}
      <ListContainer>
        <FlashList<DAO | UserProfile>
          contentContainerStyle={styles}
          onLoad={onFlashListLoaded}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={40}
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={LoadingIcon}
        />
      </ListContainer>
    </>
  );
};

export default ListCard;
