import { Icons } from '@/assets';
import Row from '@/components/Row';
import { H3, H5 } from '@/components/Typography';
import { AppRootParams } from '@/navigations/types';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';

const Container = styled.View(
  ({ theme: { colors, space, horizontalSpace } }) => ({
    backgroundColor: colors.black[2],
    paddingVertical: space[4],
    borderRadius: 10,
    paddingHorizontal: horizontalSpace[4],
    gap: space[2],
  }),
);

const StyledRow = styled(Row)(({ theme: { horizontalSpace } }) => ({
  gap: horizontalSpace[2],
  alignItems: 'center',
}));

const CustomPressable = styled.Pressable(({ theme: { horizontalSpace } }) => ({
  gap: horizontalSpace[2],
  alignItems: 'center',
  flexDirection: 'row',
}));
const CommunityReward = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation<NavigationProp<AppRootParams>>();

  const handleNavigate = () => {
    navigate('GetMoreReward');
  };

  return (
    <Container>
      <StyledRow>
        <Icons.CommunityIcon />
        <H3 fontWeight="bold">Community Reward</H3>
      </StyledRow>
      <H5 color={colors.black[1]}>
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
        sint. Velit officia consequat..
      </H5>
      <StyledRow>
        <CustomPressable onPress={handleNavigate}>
          <H5 fontWeight="bold" color={colors.lightGreen}>
            Get More Reward
          </H5>
          <Icons.QuestionMarkIcon />
        </CustomPressable>
      </StyledRow>
    </Container>
  );
};

export default CommunityReward;
