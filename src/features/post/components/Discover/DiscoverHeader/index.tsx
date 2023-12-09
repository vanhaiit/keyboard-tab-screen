import { Icons } from '@/assets';
import { Label } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Pressable } from 'react-native';

const Container = styled.View(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const IconBox = styled.View(() => ({}));
const Wrapper = styled(Pressable)(({ theme: { horizontalSpace } }) => ({
  gap: horizontalSpace[1],
  flexDirection: 'row',
  alignItems: 'center',
}));

interface Props {
  leftLabel: string;
  onSeeMorePress?: () => void;
}

const DiscoverHeader = ({ leftLabel, onSeeMorePress }: Props) => {
  const { colors } = useTheme();
  return (
    <Container>
      <Label fontWeight="bold" color={colors.lightGreen}>
        {leftLabel}
      </Label>
      <Wrapper onPress={onSeeMorePress}>
        <IconBox>
          <Icons.PlusIc color={colors.white} />
        </IconBox>
        <Label fontWeight="bold" color={colors.white}>
          See more
        </Label>
      </Wrapper>
    </Container>
  );
};

export default DiscoverHeader;
