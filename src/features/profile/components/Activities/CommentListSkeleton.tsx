import Skeleton from '@/components/Skeleton';
import styled from '@emotion/native';
import { View, FlatList } from 'react-native/';

const Container = styled(View)(({ theme: { colors, space } }) => ({
  paddingVertical: space[4],
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.whiteTransparent[1],
}));

const HeaderInfo = styled.View(({ theme: {} }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
}));

const ReplyComment = styled.View(
  ({ theme: { colors, space, borderRadius } }) => ({
    backgroundColor: colors.black[2],
    paddingHorizontal: space[4],
    paddingVertical: space[3],
    borderRadius: borderRadius.medium,
    marginTop: space[3],
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

const data = new Array(3).fill('');

const renderItem = () => {
  return (
    <Container>
      <HeaderInfo>
        <AvatarSkeleton />
        <ShortBarSkeleton />
      </HeaderInfo>
      <LongBarSkeleton />
      <ReplyComment>
        <HeaderInfo>
          <AvatarSkeleton />
          <ShortBarSkeleton />
        </HeaderInfo>
        <LongBarSkeleton />
      </ReplyComment>
    </Container>
  );
};

const CommentListSkeleton = () => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};
export default CommentListSkeleton;
