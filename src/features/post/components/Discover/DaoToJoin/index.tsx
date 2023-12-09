import { DAO } from '@/features/dao/types';
import DiscoverList from '../DiscoverList';
import DaoItem from './DaoItem';

interface Props {
  data: DAO[];
  loading: boolean;
  onSeeMore?: () => void;
}

const DaoToJoin = ({ data, loading, onSeeMore }: Props) => {
  return (
    <DiscoverList
      renderItem={DaoItem}
      onSeeMore={onSeeMore}
      data={data}
      loading={loading}
      title="DAO to join"
    />
  );
};

export default DaoToJoin;
