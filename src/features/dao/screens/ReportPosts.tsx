import { Icons } from '@/assets';
import { H1, H2, H5 } from '@/components/Typography';
import Post from '@/features/post/components/Post';
import { IPost } from '@/features/post/types/Post';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetReportedPostsQuery } from '../slice/api';

export default function ReportedPosts({ route }: any) {
  const navigation = useNavigation();
  const { id } = route.params as any;
  const { space, colors } = useTheme();
  const {
    combinedData: posts,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetReportedPostsQuery,
    params: {
      id,
      _limit: -1,
    },
  });

  const styles = useMemo(() => {
    return {
      padding: space[4],
    };
  }, [space]);

  const LoadingIcon = useMemo(() => {
    return (
      <>
        {isFetching ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color={colors.white} />
          </LoadingContainer>
        ) : null}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isFetching]);

  const renderSeparator = useCallback(() => <Separator />, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaViewContainer>
        <Header>
          <HeaderLeft>
            <BtnBack onPress={() => navigation.goBack()}>
              <Icons.ArrowLeft />
            </BtnBack>
            <Title fontWeight="bold">
              Reported Posts{' '}
              <TitleHighlight fontWeight="bold">
                ({posts.length})
              </TitleHighlight>{' '}
            </Title>
          </HeaderLeft>
        </Header>
        <Container>
          {posts.length === 0 && !isFetching ? (
            <EmptyData>
              <Icons.ReportNoData />
              <TitleEmpty>See that stuff in the nav?</TitleEmpty>
              <DescriptionEmpty>
                Pick something and it’ll show up gere. Go ahead. We’ll wait.
              </DescriptionEmpty>
            </EmptyData>
          ) : (
            <FlashList
              contentContainerStyle={styles}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={renderSeparator}
              data={posts as IPost[]}
              keyExtractor={(item: IPost, index: number) =>
                item.id.toString() + index
              }
              renderItem={({ item }: any) => (
                <Post
                  blind={{ isBlind: item.isBlind, reports: item.reports }}
                  key={item.id}
                  postData={item!}
                />
              )}
              estimatedItemSize={200}
              onEndReachedThreshold={0.5}
              ListFooterComponent={LoadingIcon}
            />
          )}
        </Container>
      </SafeAreaViewContainer>
    </KeyboardAvoidingView>
  );
}

const DescriptionEmpty = styled(H5)(({ theme: { colors } }) => ({
  color: colors.grey[1],
  textAlign: 'center',
}));

const TitleEmpty = styled(H2)(({ theme: { colors } }) => ({
  color: colors.white,
  textAlign: 'center',
}));

const EmptyData = styled.View(({ theme: { space, horizontalSpace } }) => ({
  width: '100%',
  height: space[53],
  alignItems: 'center',
  paddingTop: space[40],
  padding: horizontalSpace[5],
}));

const TitleHighlight = styled(H1)(({ theme: { colors } }) => ({
  color: colors.lightGreen,
}));

const Separator = styled.View(({ theme: { space } }) => ({
  height: space[5],
}));

const LoadingContainer = styled.View(({ theme: { space } }) => ({
  height: space[8],
  justifyContent: 'flex-end',
}));

const Title = styled(H1)({
  color: 'white',
});

const BtnBack = styled.TouchableOpacity(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[7],
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Header = styled.View(({ theme: { space, horizontalSpace } }) => ({
  height: space[10],
  paddingLeft: horizontalSpace[4],
  paddingRight: horizontalSpace[4],
  flexDirection: 'row',
  justifyContent: 'space-between',
}));

const HeaderLeft = styled.View({
  width: '80%',
  height: '100%',
  flexDirection: 'row',
  alignItems: 'center',
});

const SafeAreaViewContainer = styled(SafeAreaView)(({ theme: { colors } }) => ({
  backgroundColor: colors.black[3],
}));

const Container = styled.View(({ theme: { colors } }) => ({
  display: 'flex',
  backgroundColor: colors.black[3],
  height: '100%',
}));
