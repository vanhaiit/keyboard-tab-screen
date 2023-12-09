import Skeleton from '@/components/Skeleton';
import styled from '@emotion/native';
import { View, FlatList } from 'react-native/';

const Container = styled(View)(
  ({ theme: { colors, space, borderRadius } }) => ({
    flexDirection: 'row',
    backgroundColor: colors.black[2],
    padding: space[4],
    borderRadius: borderRadius.medium,
    marginTop: space[2],
  }),
);

const AvatarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space, borderRadius } }) => ({
  height: space[10],
  width: space[10],
  backgroundColor: colors.black[1],
  borderRadius: borderRadius.full,
  marginRight: space[2],
}));

const ShortBarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[3],
  width: space[30],
  backgroundColor: colors.black[1],
}));

const LongBarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[3],
  width: '100%',
  backgroundColor: colors.black[1],
  marginTop: space[2],
}));

const Body = styled(View)(({ theme: {} }) => ({
  flex: 1,
}));

const data = new Array(4).fill('').map((_, index) => index);

const renderItem = () => {
  return (
    <Container>
      <AvatarSkeleton />
      <Body>
        <ShortBarSkeleton />
        <LongBarSkeleton />
        <LongBarSkeleton />
      </Body>
    </Container>
  );
};

const InviteListSkeleton = () => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data}
      keyExtractor={(item: number) => item.toString()}
      renderItem={renderItem}
    />
  );
};
export default InviteListSkeleton;
