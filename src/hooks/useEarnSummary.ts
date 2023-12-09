import { useGetEarnSummaryQuery } from '@/features/earn/slice/api';
import { ChartActionType, EarnSummary } from '@/features/earn/types';
import formatLargeNumber from '@/utils/formatLargeNumber';
import { useCallback, useMemo } from 'react';

const useEarnSummary = () => {
  const { data } = useGetEarnSummaryQuery({
    _limit: -1,
    _start: 0,
  });

  const calculatedData = useMemo(() => {
    const total = {
      earned: 0,
      claimable: 0,
    };

    if (data) {
      const post = data.find(item => item.type === 'post');
      const comment = data.find(item => item.type === 'comment');
      const upvote = data.find(item => item.type === 'upvote');
      const invite = data.find(item => item.type === 'referral');
      const accept = data.find(item => item.type === 'referral-accept');
      const others = data.find(item => item.type === 'other');
      if (post) {
        total.earned += post.totalReward;
        total.claimable += post.totalReward;
      }
      if (comment) {
        total.earned += comment.totalReward;
        total.claimable += comment.totalReward;
      }
      if (upvote) {
        total.earned += upvote.totalReward;
        total.claimable += upvote.totalReward;
      }
      if (invite) {
        total.earned += invite.totalReward;
        total.claimable += invite.totalReward;
      }
      if (accept) {
        total.earned += accept.totalReward;
        total.claimable += accept.totalReward;
      }
      if (others) {
        total.earned += others.totalReward;
        total.claimable += others.totalReward;
      }
    }

    return {
      earned: formatLargeNumber(total.earned.toString(), 2),
      claimable: formatLargeNumber(total.claimable.toString(), 2),
    };
  }, [data]);

  const getData = useCallback(
    (type: ChartActionType, earnData?: EarnSummary[]) => {
      if (earnData) {
        const foundData = earnData.find(item => item.type === type);
        if (foundData) {
          return {
            count: foundData.count,
            reward: foundData.totalReward,
          };
        }
      }
      return {
        count: 0,
        reward: 0,
      };
    },
    [],
  );

  return {
    calculatedData,
    getData,
    earnData: data,
  };
};

export default useEarnSummary;
