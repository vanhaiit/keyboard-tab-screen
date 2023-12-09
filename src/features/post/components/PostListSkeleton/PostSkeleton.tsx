import Skeleton from '@/components/Skeleton';
import styled from '@emotion/native';
import { View } from 'react-native/';

const Container = styled(View)(({ theme: { colors, space } }) => ({
  backgroundColor: colors.palette.black[2],
  borderRadius: 10,
  paddingVertical: space[6],
  flex: 1,
}));

const Header = styled(View)(({ theme: { space } }) => ({
  marginBottom: space[4],
  paddingHorizontal: space[4],
}));

const AvatarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[15],
  width: space[15],
  backgroundColor: colors.black[1],
  borderRadius: 100,
}));

const ShortBarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[3],
  width: space[20],
  backgroundColor: colors.black[1],
}));

const LongBarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[3],
  width: space[60],
  backgroundColor: colors.black[1],
}));

const AuthorContainer = styled(View)(({ theme: { space } }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: space[2],
}));

const InfoBox = styled(View)(({ theme: { space } }) => ({
  gap: space[2],
}));

const Body = styled(View)(({ theme: { space } }) => ({
  gap: space[2],
  paddingHorizontal: space[4],
}));

interface Props {
  mode: 'Trending' | 'Post';
}

const PostSkeleton = ({ mode }: Props) => {
  return (
    <Container>
      <Header>
        <AuthorContainer>
          {mode === 'Post' && <AvatarSkeleton />}
          <InfoBox>
            <ShortBarSkeleton />
            <ShortBarSkeleton />
          </InfoBox>
        </AuthorContainer>
      </Header>
      <Body>
        <LongBarSkeleton />
        <LongBarSkeleton />
        <LongBarSkeleton />
        <LongBarSkeleton />
        {mode === 'Trending' && (
          <>
            <LongBarSkeleton />
            <LongBarSkeleton />
            <LongBarSkeleton />
            <LongBarSkeleton />
            <LongBarSkeleton />
            <LongBarSkeleton />
          </>
        )}
      </Body>
    </Container>
  );
};
export default PostSkeleton;
