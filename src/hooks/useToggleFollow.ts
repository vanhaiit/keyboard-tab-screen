import {
  useFollowUserMutation,
  useUnFollowUserMutation,
} from '@/features/profile/slice/api';
import { useEffect, useState } from 'react';

const useToggleFollow = (
  isFollowed: boolean,
  onToggleFollowSuccess?: (followed: boolean) => void,
) => {
  const [followStatus, setFollowStatus] = useState(isFollowed);

  const [followUser, { isLoading: isFollowing, isSuccess: isFollowSuccess }] =
    useFollowUserMutation();

  const [
    unFollowUser,
    { isLoading: isUnfollowing, isSuccess: isUnfollowSuccess },
  ] = useUnFollowUserMutation();

  const handleOnToggleFollow = (id: string, followed: boolean) => async () => {
    const payload = { follow: id };
    if (followed) {
      await unFollowUser(payload);
    } else {
      await followUser(payload);
    }
  };

  useEffect(() => {
    if (isFollowSuccess) {
      setFollowStatus(true);
      if (onToggleFollowSuccess) {
        onToggleFollowSuccess(true);
      }
    }
  }, [isFollowSuccess, onToggleFollowSuccess]);

  useEffect(() => {
    if (isUnfollowSuccess) {
      setFollowStatus(false);
      if (onToggleFollowSuccess) {
        onToggleFollowSuccess(false);
      }
    }
  }, [isUnfollowSuccess, onToggleFollowSuccess]);

  return {
    followStatus,
    isUnfollowing,
    isFollowing,
    handleOnToggleFollow,
  };
};

export default useToggleFollow;
