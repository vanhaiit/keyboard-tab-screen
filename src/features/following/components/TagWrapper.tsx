import styled from '@emotion/native';
import { FlashList } from '@shopify/flash-list';
import { TagData } from '../types';
import ListSkeleton from './ListSkeleton';
import TagItem from './TagItem';
import Empty from '@/components/Empty';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';

const Container = styled.View(({ theme: { space } }) => ({
  flex: 1,
  paddingTop: space[1],
}));

interface IProps {
  data: TagData[];
  isLoading?: boolean;
  onCallBackIsFollow?: (isFollow: boolean) => void;
}

const TagsWrapper = ({ data, isLoading, onCallBackIsFollow }: IProps) => {
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
          renderItem={({ item }: { item: TagData; index: number }) => {
            return (
              <TagItem
                key={item?.id}
                data={item}
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
export default TagsWrapper;
