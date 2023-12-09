import { Icons } from '@/assets';
import { H5, Label } from '@/components/Typography';
import { AppRootParams } from '@/navigations/types';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import useEarnSummary from '@/hooks/useEarnSummary';

const Container = styled.View(({ theme: { space } }) => ({
  borderRadius: 10,
  gap: space[4],
}));

const Item = styled.View(({ theme: { space } }) => ({
  gap: space[1],
}));

const StyledRow = styled.Pressable(
  ({ theme: { colors, horizontalSpace, space } }) => ({
    backgroundColor: colors.black[2],
    paddingVertical: space[4],
    paddingHorizontal: horizontalSpace[4],
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  }),
);

const IconBox = styled.View(({ theme: { colors, horizontalSpace } }) => ({
  width: horizontalSpace[5],
  height: horizontalSpace[5],
  backgroundColor: colors.lightGreen,
  borderRadius: 100,
  padding: 2,
}));

const EarnRewardDescriptions = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation<NavigationProp<AppRootParams>>();

  const handleNavigate = () => {
    navigate('RewardDetail');
  };

  const { earnData, getData } = useEarnSummary();

  return (
    <Container>
      <StyledRow onPress={handleNavigate}>
        <Item>
          <Label fontWeight="medium" color={colors.grey[1]}>
            {getData('comment', earnData).count} Comments
          </Label>
          <H5 fontWeight="bold">
            {getData('comment', earnData).reward} $THINK
          </H5>
        </Item>
        <IconBox>
          <Icons.CommentsIcon2 color={'black'} />
        </IconBox>
      </StyledRow>
      <StyledRow onPress={handleNavigate}>
        <Item>
          <Label fontWeight="medium" color={colors.grey[1]}>
            {getData('post', earnData).count} Posts
          </Label>
          <H5 fontWeight="bold">{getData('post', earnData).reward} $THINK</H5>
        </Item>
        <IconBox>
          <Icons.DraftIcon color={'black'} />
        </IconBox>
      </StyledRow>
      <StyledRow onPress={handleNavigate}>
        <Item>
          <Label fontWeight="medium" color={colors.grey[1]}>
            {getData('upvote', earnData).count} Upvotes
          </Label>
          <H5 fontWeight="bold">{getData('upvote', earnData).reward} $THINK</H5>
        </Item>
        <IconBox>
          <Icons.LikeIcon color={'black'} />
        </IconBox>
      </StyledRow>
      <StyledRow onPress={handleNavigate}>
        <Item>
          <Label fontWeight="medium" color={colors.grey[1]}>
            {getData('referral-accept', earnData).count} Invitations accepted
          </Label>
          <H5 fontWeight="bold">
            {getData('referral-accept', earnData).reward} $THINK
          </H5>
        </Item>
        <IconBox>
          <Icons.Send color={'black'} />
        </IconBox>
      </StyledRow>
      <StyledRow onPress={handleNavigate}>
        <Item>
          <Label fontWeight="medium" color={colors.grey[1]}>
            {getData('other', earnData).count} Other(s)
          </Label>
          <H5 fontWeight="bold">{getData('other', earnData).reward} $THINK</H5>
        </Item>
        <IconBox>
          <Icons.OxIcon color={'black'} />
        </IconBox>
      </StyledRow>
    </Container>
  );
};

export default EarnRewardDescriptions;
