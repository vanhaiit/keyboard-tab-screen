import styled from '@emotion/native';
import { FlashList } from '@shopify/flash-list';
import { DAOData } from '../types';
import DAOItem from './DaoItem';
import ListSkeleton from './ListSkeleton';
import Empty from '@/components/Empty';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';

const Container = styled.View(({ theme: { space } }) => ({
  flex: 1,
  paddingTop: space[1],
}));

const Separator = styled.View(({ theme: { space } }) => ({
  height: space[2],
}));

interface IProps {
  data: DAOData[];
  isLoading?: boolean;
}

const DAOWrapper = ({ data, isLoading }: IProps) => {
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
          ItemSeparatorComponent={() => <Separator />}
          data={data}
          keyExtractor={_ => _.id.toString()}
          estimatedItemSize={200}
          renderItem={({ item, index }: { item: DAOData; index: number }) => {
            return <DAOItem data={item} key={index} />;
          }}
        />
      ) : (
        <Empty />
      )}
    </Container>
  );
};
export default DAOWrapper;
