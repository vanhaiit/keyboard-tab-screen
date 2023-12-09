import { UserProfile } from '@/features/profile/types';
import DiscoverList from '../DiscoverList';
import UserToFollowItem from './UserToFollowItem';

interface Props {
  data: UserProfile[];
  loading: boolean;
  onSeeMore: () => void;
}

const UserToFollow = ({ data, loading, onSeeMore }: Props) => {
  return (
    <DiscoverList
      renderItem={UserToFollowItem}
      onSeeMore={onSeeMore}
      data={data}
      loading={loading}
      title="User to follow"
    />
  );
};

export default UserToFollow;
