import styled from '@emotion/native';
import { FlashList } from '@shopify/flash-list';
import Skeleton from '@/components/Skeleton';
import { IUserDAO, RoleDao } from '../../types';
import Empty from '@/components/Empty';
import { MemberAction } from './MemberAction';
import { useState } from 'react';

const ContainerList = styled.View(({ theme: {} }) => ({
  flex: 1,
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

const EmptyBox = styled(Empty)(({ theme: { space } }) => ({
  flex: 0,
  marginTop: space[4],
}));

interface IListMembers {
  data: IUserDAO[];
  isLoading: boolean;
  idDao: string;
  roleCurrentUser: RoleDao;
}

const ItemSkeleton = () => {
  return (
    <Container>
      <AvatarSkeleton />
      <ShortBarSkeleton />
    </Container>
  );
};

const ListMembers = ({
  data,
  isLoading,
  idDao,
  roleCurrentUser,
}: IListMembers) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleSwipeableOpen = (index: number) => {
    setActiveIndex(index);
  };

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
          onEndReachedThreshold={0.5}
          data={data}
          extraData={activeIndex}
          keyExtractor={_ => _.id.toString()}
          renderItem={({ item, index }: { item: IUserDAO; index: number }) => {
            return (
              <MemberAction
                role={item?.role}
                status={item?.status}
                avatar={item?.profile?.avatar?.url || ''}
                userName={item?.profile?.username}
                idProfile={item?.profile?.id}
                idDao={idDao}
                roleCurrentUser={roleCurrentUser}
                index={index}
                onSwipeableOpen={handleSwipeableOpen}
                activeIndex={activeIndex}
              />
            );
          }}
        />
      ) : (
        <EmptyBox />
      )}
    </ContainerList>
  );
};

export default ListMembers;
