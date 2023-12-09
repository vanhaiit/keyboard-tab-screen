import { Icons } from '@/assets';
import { Label, TinyLabel } from '@/components/Typography';
import formatLargeNumber from '@/utils/formatLargeNumber';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import { EarnActions } from '../types';
import get from 'lodash/get';

const Container = styled.View(
  ({ theme: { colors, horizontalSpace, space } }) => ({
    backgroundColor: colors.black[2],
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[4],
    borderRadius: 10,
    flexDirection: 'row',
    gap: horizontalSpace[4],
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }),
);
const IconBox = styled.View(({ theme: { colors, horizontalSpace } }) => ({
  width: horizontalSpace[5],
  height: horizontalSpace[5],
  backgroundColor: colors.lightGreen,
  borderRadius: 100,
  padding: 2,
}));

const InfoBox = styled.View(({ theme: { space } }) => ({
  gap: space[1],
  flex: 1,
}));
const LeftBox = styled.View(({ theme: { horizontalSpace } }) => ({
  gap: horizontalSpace[2],
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
}));
const RightBox = styled.View(({ theme: { horizontalSpace } }) => ({
  gap: horizontalSpace[2],
  flexDirection: 'row',
  alignItems: 'center',
}));

const renderLabel = (record: EarnActions) => {
  if (record.actionType === 'post') {
    return 'Create a post: ' + `"${get(record, 'post.title', '')}"`;
  } else if (record.actionType === 'comment') {
    return 'Comment in post: ' + `"${get(record, 'post.title', '')}"`;
  } else if (record.actionType === 'upvote') {
    return 'Upvote in post: ' + `"${get(record, 'post.title', '')}"`;
  } else if (record.actionType === 'referral-accept') {
    return 'You have been accepted invitation';
  }
  return null;
};

interface Props {
  data: EarnActions;
}

const EarnRewardCardItem = ({ data }: Props) => {
  const { colors } = useTheme();
  return (
    <Container>
      <LeftBox>
        <IconBox>
          <Icons.DraftIcon color={'black'} />
        </IconBox>
        <InfoBox>
          <Label numberOfLines={2} fontWeight="bold">
            {renderLabel(data)}
          </Label>
          <TinyLabel color={colors.grey[1]}>
            {dayjs(data.date).format('YYYY-MM-DD')}
          </TinyLabel>
        </InfoBox>
      </LeftBox>
      <RightBox>
        <Label fontWeight="bold">
          +{formatLargeNumber(data.reward, 2)} $INK
        </Label>
        <Icons.ColoredLogo />
      </RightBox>
    </Container>
  );
};

export default EarnRewardCardItem;
