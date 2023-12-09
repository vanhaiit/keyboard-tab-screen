import { ProfileCardItem } from '@/components/ProfileCardItem';
import Empty from '@/components/Empty';
import styled from '@emotion/native';
import { FlashList } from '@shopify/flash-list';
import { FollowData } from '../types';
import ListSkeleton from './ListSkeleton';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';

const Container = styled.View(({ theme: { space } }) => ({
  flex: 1,
  paddingTop: space[1],
}));

interface IFollowWrapper {
  data?: FollowData[];
  isFollower?: boolean;
  isLoading?: boolean;
  onCallBackIsFollow?: (isFollow: boolean, id?: string) => void;
}

const FollowWrapper = ({
  data,
  isFollower,
  isLoading,
  onCallBackIsFollow,
}: IFollowWrapper) => {
  const { space } = useTheme();

  const styles = useMemo(() => {
    return {
      paddingBottom: space[6],
    };
  }, [space]);

  return (
    <Container>
      {isLoading ? (
        <ListSkeleton />
      ) : data && data?.length > 0 ? (
        <FlashList
          contentContainerStyle={styles}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={_ => _.id.toString()}
          estimatedItemSize={200}
          renderItem={({ item }: { item: FollowData }) => {
            return (
              <ProfileCardItem
                key={item?.id}
                item={isFollower ? item?.follower : item?.follow}
                hideDescription
                hideUniqueId
                isFollow={item?.isFollowing}
                callBackIsFollow={onCallBackIsFollow}
              />
            );
          }}
        />
      ) : (
        <Empty />
      )}
    </Container>
  );
};
export default FollowWrapper;
