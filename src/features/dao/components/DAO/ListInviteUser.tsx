import { UserProfile } from '@/features/profile/types';
import styled from '@emotion/native';
import { FlashList } from '@shopify/flash-list';
import { CardIMember } from './CardIMember';
import Skeleton from '@/components/Skeleton';
import { useMemo } from 'react';
import { ActivityIndicator } from 'react-native';
import EmptyPostList from '@/features/post/components/EmptyPostList';
import { InviteAction } from './InviteAction';

const ContainerList = styled.View(({ theme: { space } }) => ({
  flex: 1,
  paddingTop: space[3],
}));

const Container = styled.View(({ theme: { space } }) => ({
  marginBottom: space[6],
  flexDirection: 'row',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

const AvatarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[10],
  width: space[10],
  backgroundColor: colors.black[1],
  borderRadius: 100,
  marginRight: space[4],
}));

const ShortBarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[3],
  width: '100%',
  backgroundColor: colors.black[1],
}));

const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));

interface IListInviteUser {
  data: UserProfile[];
  loadMore?: () => void;
  isLoading: boolean;
  isFetching: boolean;
  id: string;
}

const ItemSkeleton = () => {
  return (
    <Container>
      <AvatarSkeleton />
      <ShortBarSkeleton />
    </Container>
  );
};

const ListInviteUser = ({
  data,
  isLoading,
  isFetching,
  id,
  loadMore,
}: IListInviteUser) => {
  const LoadingIcon = useMemo(() => {
    return (
      <>
        {isFetching ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color="#ffff" />
          </LoadingContainer>
        ) : (
          <></>
        )}
      </>
    );
  }, [isFetching]);

  return (
    <ContainerList>
      {isLoading ? (
        <FlashList
          showsVerticalScrollIndicator={false}
          data={new Array(8).fill('')}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => {
            return <ItemSkeleton />;
          }}
        />
      ) : data && data?.length > 0 ? (
        <FlashList
          showsVerticalScrollIndicator={false}
          estimatedItemSize={120}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          data={data}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }: { item: UserProfile }) => {
            return (
              <CardIMember
                avatar={item?.avatar?.url || ''}
                userName={item?.username}
                id={item?.id}
                actionContent={
                  <InviteAction
                    status={item?.status}
                    idDao={id}
                    id={item?.id}
                  />
                }
              />
            );
          }}
          ListFooterComponent={LoadingIcon}
        />
      ) : (
        <EmptyPostList />
      )}
    </ContainerList>
  );
};

export default ListInviteUser;
