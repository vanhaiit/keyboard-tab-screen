import styled from '@emotion/native';
import FastImage from 'react-native-fast-image';
import { horizontalScale, scale } from '@/theme/helper';
import { Icons } from '@/assets';
import { TinyLabel } from '@/components/Typography';
import { useTheme } from '@emotion/react';
type Position = '1st' | '2nd' | '3rd';

const Container = styled.View(() => ({
  justifyContent: 'center',
  alignItems: 'center',
}));

const StyledImage = styled(FastImage)(() => ({
  borderRadius: 100,
  width: '100%',
  height: '100%',
}));

const ImageBox = styled.View<{
  mode: Position;
}>(({ mode, theme: { colors } }) => ({
  width: mode === '1st' ? horizontalScale(74) : horizontalScale(50),
  height: mode === '1st' ? horizontalScale(74) : horizontalScale(50),
  borderColor: colors.darkGreen[4],
  borderWidth: mode === '1st' ? 3 : 2,
  borderRadius: 100,
}));

const Background = styled.View<{
  mode: Position;
}>(({ mode, theme: { colors } }) => ({
  width: mode === '1st' ? horizontalScale(84) : horizontalScale(50),
  height: mode === '1st' ? horizontalScale(84) : horizontalScale(50),
  backgroundColor: colors.darkGreen[5],
  position: 'absolute',
  borderRadius: 100,
  zIndex: -1,
}));

const HeaderContainer = styled.View<{ mode: Position }>(({ mode }) => ({
  marginBottom: mode !== '1st' ? scale(6) : 0,
  alignItems: 'center',
  justifyContent: 'center',
}));

interface Props {
  position: Position;
  url?: string;
}

interface HeaderParams {
  mode: Position;
}

const ArrowIcon = ({ position }: { position: Position }) => {
  const { colors } = useTheme();

  return (
    <Icons.ArrowUpIcon
      color={position === '2nd' ? colors.darkGreen[3] : colors.alertRed}
      transform={[
        {
          rotate: position === '2nd' ? '0deg' : '180deg',
        },
      ]}
    />
  );
};

const Header = ({ mode }: HeaderParams) => {
  const { colors } = useTheme();
  return (
    <HeaderContainer mode={mode}>
      {mode === '1st' && <Icons.CrownIcon />}
      {mode !== '1st' && (
        <>
          <TinyLabel fontWeight="bold" color={colors.lightGreen}>
            {mode === '2nd' ? 2 : 3}
          </TinyLabel>
          <ArrowIcon position={mode} />
        </>
      )}
    </HeaderContainer>
  );
};

const LeaderAvatar = ({ position, url }: Props) => {
  return (
    <Container>
      <Header mode={position} />
      <Container>
        <ImageBox mode={position}>
          <StyledImage
            source={
              url
                ? {
                    uri: url,
                  }
                : require('@/assets/images/gray-logo.png')
            }
          />
        </ImageBox>
        {position === '1st' && <Background mode={position} />}
      </Container>
    </Container>
  );
};

export default LeaderAvatar;
