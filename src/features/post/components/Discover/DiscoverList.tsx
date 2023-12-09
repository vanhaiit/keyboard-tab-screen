import { Icons } from '@/assets';
import { Label } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import EmptyPostList from '../EmptyPostList';
import TrendingSkeleton from '../Review/Trending/TrendingSkeleton';

const Container = styled(View)(({ theme: { space } }) => ({
  marginTop: space[9],
}));

const PostItem = styled(View)(
  ({ theme: { horizontalSpace, window, colors } }) => ({
    width: window.width - horizontalSpace[18],
    backgroundColor: colors.palette.black[2],
    borderRadius: 10,
  }),
);

const TitleWrapper = styled(View)(({ theme: { horizontalSpace, space } }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: horizontalSpace[4],
  alignItems: 'center',
  marginBottom: space[4],
}));

const Title = styled(Label)(({ theme: { colors } }) => ({
  color: colors.lightGreen,
}));

const EmptyContainer = styled(View)(
  ({ theme: { space, horizontalSpace } }) => ({
    marginHorizontal: horizontalSpace[4],
    height: space[45],
  }),
);

const StyledPressable = styled.TouchableOpacity(
  ({ theme: { horizontalSpace } }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalSpace[1],
  }),
);

interface Props {
  data: any[];
  loading: boolean;
  title?: string;
  onSeeMore?: () => void;
  renderItem: ({ data }: { data: any }) => JSX.Element;
}

const DiscoverList = ({
  data,
  loading,
  title = 'Trending',
  onSeeMore,
  renderItem: RenderItem,
}: Props) => {
  const { space, colors } = useTheme();

  const containerStyles = useMemo(
    () => ({
      gap: space[4],
      paddingLeft: space[4],
    }),
    [space],
  );

  return (
    <Container>
      <TitleWrapper>
        <Title fontWeight="bold">{title}</Title>
        {onSeeMore && (
          <StyledPressable onPress={onSeeMore}>
            <Icons.PlusIc color={colors.white} />
            <Label fontWeight="bold">See more</Label>
          </StyledPressable>
        )}
      </TitleWrapper>

      {loading ? (
        <TrendingSkeleton />
      ) : data.length > 0 ? (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={containerStyles}
          horizontal={true}>
          {data.length > 0 &&
            data.map(item => {
              return (
                <PostItem key={item.id}>
                  <RenderItem data={item} />
                </PostItem>
              );
            })}
        </ScrollView>
      ) : (
        <EmptyContainer>
          <EmptyPostList />
        </EmptyContainer>
      )}
    </Container>
  );
};

export default DiscoverList;
