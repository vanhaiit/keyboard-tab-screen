import Skeleton from '@/components/Skeleton';
import styled from '@emotion/native';

const Container = styled.View(({ theme: { colors, space } }) => ({
  backgroundColor: colors.palette.black[2],
  borderRadius: 10,
  flex: 1,
  alignItems: 'center',
  flexDirection: 'row',
  paddingHorizontal: space[4],
  paddingVertical: space[2],
  gap: space[2],
}));

const AvatarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[12],
  width: space[12],
  backgroundColor: colors.black[1],
  borderRadius: 100,
}));

const LongBarSkeleton = styled((props: any) => {
  return <Skeleton style={props.style[0]} />;
})(({ theme: { colors, space } }) => ({
  height: space[3],
  width: space[60],
  backgroundColor: colors.black[1],
}));

const InfoBox = styled.View(({ theme: { space } }) => ({
  gap: space[2],
}));

interface Props {
  mode: 'Trending' | 'Post';
}

const CardSkeleton = ({ mode }: Props) => {
  return (
    <Container>
      {mode === 'Post' && <AvatarSkeleton />}
      <InfoBox>
        <LongBarSkeleton />
        <LongBarSkeleton />
      </InfoBox>
    </Container>
  );
};
export default CardSkeleton;
