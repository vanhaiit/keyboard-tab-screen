import Skeleton from '@/components/Skeleton';
import styled from '@emotion/native';
import { useCallback } from 'react';
import { FlatList } from 'react-native/';

const Separator = styled.View(({ theme: {} }) => ({}));

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

const ItemSkeleton = () => {
  return (
    <Container>
      <AvatarSkeleton />
      <ShortBarSkeleton />
    </Container>
  );
};

const ListSkeleton = () => {
  const renderSeparator = useCallback(() => <Separator />, []);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={renderSeparator}
      data={new Array(4).fill('')}
      keyExtractor={item => item.toString()}
      renderItem={() => {
        return <ItemSkeleton />;
      }}
    />
  );
};
export default ListSkeleton;
