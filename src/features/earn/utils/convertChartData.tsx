import styled from '@emotion/native';
import dayjs from 'dayjs';
import { ChartActionType, ChartData } from '../types';
const StyledText = styled.Text(({ theme: { colors } }) => ({
  color: colors.grey[1],
  width: '100%',
  fontSize: 10,
  textAlign: 'center',
}));
const oneMonthDays = [...Array(30)];
const format = 'YYYY-MM-DD';

const getData = (
  previousData: any,
  foundData: any,
  type: ChartActionType,
  now: string,
  hasLabel?: boolean,
) => {
  if (hasLabel) {
    if (foundData) {
      return [
        ...previousData,
        {
          ...foundData,
          value: foundData.count,
          labelComponent: () => {
            return <StyledText numberOfLines={1}>{now}</StyledText>;
          },
        },
      ];
    } else {
      return [
        ...previousData,
        {
          date: now,
          count: 0,
          actionType: type,
          value: 0,
          labelComponent: () => (
            <StyledText numberOfLines={1}>{now}</StyledText>
          ),
        },
      ];
    }
  } else {
    if (foundData) {
      return [
        ...previousData,
        {
          ...foundData,
          value: foundData.count,
        },
      ];
    } else {
      return [
        ...previousData,
        {
          date: now,
          count: 0,
          actionType: type,
          value: 0,
        },
      ];
    }
  }
};

const convertChartData = (data: ChartData[]) => {
  let maxValue = 0;
  const earnMonthData = oneMonthDays.reduce(
    (acc, _, index) => {
      const now = dayjs()
        .subtract(oneMonthDays.length - index, 'd')
        .format(format);
      const postFound = data.find(
        item => item.date === now && item.actionType === 'post',
      );
      const upvoteFound = data.find(
        item => item.date === now && item.actionType === 'upvote',
      );
      const commentFound = data.find(
        item => item.date === now && item.actionType === 'comment',
      );
      const referralAcceptFound = data.find(
        item => item.date === now && item.actionType === 'referral-accept',
      );
      const referralFound = data.find(
        item => item.date === now && item.actionType === 'referral',
      );
      const otherFound = data.find(
        item => item.date === now && item.actionType === 'other',
      );
      maxValue = Math.max(
        ...[
          postFound?.count || 0,
          upvoteFound?.count || 0,
          commentFound?.count || 0,
          referralAcceptFound?.count || 0,
          referralFound?.count || 0,
          otherFound?.count || 0,
        ],
        maxValue,
      );
      return {
        post: getData(acc.post, postFound, 'post', now, true),
        upvote: getData(acc.upvote, upvoteFound, 'upvote', now),
        comment: getData(acc.comment, commentFound, 'comment', now),
        referralAccept: getData(
          acc.referralAccept,
          referralAcceptFound,
          'referral-accept',
          now,
        ),
        referral: getData(acc.referral, referralFound, 'referral', now),
        other: getData(acc.other, referralFound, 'other', now),
      };
    },
    {
      post: [],
      upvote: [],
      comment: [],
      referralAccept: [],
      referral: [],
      other: [],
    },
  );
  const earn7DaysData = {
    post: earnMonthData.post.slice(
      oneMonthDays.length - 7,
      oneMonthDays.length,
    ),
    upvote: earnMonthData.upvote.slice(
      oneMonthDays.length - 7,
      oneMonthDays.length,
    ),
    comment: earnMonthData.comment.slice(
      oneMonthDays.length - 7,
      oneMonthDays.length,
    ),
    referralAccept: earnMonthData.referralAccept.slice(
      oneMonthDays.length - 7,
      oneMonthDays.length,
    ),
    referral: earnMonthData.referral.slice(
      oneMonthDays.length - 7,
      oneMonthDays.length,
    ),
    other: earnMonthData.other.slice(
      oneMonthDays.length - 7,
      oneMonthDays.length,
    ),
  };

  return {
    earnMonthData,
    earn7DaysData,
    maxValue,
  };
};

export default convertChartData;
