import Skeleton from '@/components/Skeleton';
import styled from '@emotion/native';
import { View } from 'react-native/';

const Container = styled(View)(
  ({ theme: { colors, space, borderRadius } }) => ({
    backgroundColor: colors.palette.black[2],
    borderRadius: borderRadius.medium,
    padding: space[2],
    width: '48%',
    minHeight: space[45],
    marginHorizontal: '1%',
  }),
);

const AvatarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[15],
  width: space[15],
  backgroundColor: colors.black[1],
  borderRadius: 100,
  marginBottom: space[6],
}));

const ShortBarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[3],
  width: space[10],
  backgroundColor: colors.black[1],
}));

const LongBarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[3],
  width: '100%',
  backgroundColor: colors.black[1],
}));

const Body = styled(View)(({ theme: { space } }) => ({
  gap: space[2],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
}));
const NFTSkeleton = () => {
  return (
    <Container>
      <ShortBarSkeleton />
      <Body>
        <AvatarSkeleton />
        <LongBarSkeleton />
        <LongBarSkeleton />
      </Body>
    </Container>
  );
};
export default NFTSkeleton;
