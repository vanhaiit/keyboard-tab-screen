import { H4, H5 } from '@/components/Typography';
import { theme } from '@/theme';
import formatLargeNumber from '@/utils/formatLargeNumber';
import styled from '@emotion/native';
import get from 'lodash/get';
import React from 'react';
import RelatedDAO from '../SearchDetail/RelatedDAO';
import RelatedPosts from '../SearchDetail/RelatedPost';
import RelatedTags from '../SearchDetail/RelatedTags';
import RelatedUsers from '../SearchDetail/RelatedUsers';
import { SearchTabsType } from '../../screen/SearchDetail';
import { useGetTagsQuery } from '../../slice/api';
import { useAppDispatch } from '@/store/type';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppStackParams } from '@/navigations/types';
import { setSearchHistory } from '../../slice';

interface Props {
  searchContent: string;
  onPressSeeMore?: (tabValue: SearchTabsType) => void;
  onPressTag: (tagValue: string) => void;
}

const TabAll: React.FC<Props> = ({
  searchContent,
  onPressSeeMore,
  onPressTag,
}) => {
  const { data: searchTagData, isFetching } = useGetTagsQuery(
    { content: `#${searchContent}` },
    { skip: !searchContent },
  );
  const dispatch = useAppDispatch();
  const { navigate } = useNavigation<NavigationProp<AppStackParams>>();

  const tagTitle = get(searchTagData, '[0].content', '');
  const totalPost = get(searchTagData, '[0].totalPosts', 0);
  const totalFollowers = get(searchTagData, '[0].totalFollowers', 0);

  const handlePressTag = (tagValue: string) => {
    dispatch(setSearchHistory(searchContent));
    onPressTag(tagValue);
  };

  const renderInfoTag = () => {
    if ((searchTagData && searchTagData?.length <= 0) || isFetching) {
      return;
    }

    return (
      <Info>
        <InfoTagTitle fontWeight="bold">{tagTitle}</InfoTagTitle>
        <InfoContent>
          <Col>
            <InfoContentTitle>Follower</InfoContentTitle>
            <InfoContentTitle
              style={{
                marginTop: theme.space[2],
              }}>
              Total post
            </InfoContentTitle>
          </Col>
          <Col style={{}}>
            <InfoContentValue fontWeight="bold">
              {formatLargeNumber(totalFollowers.toString())}
            </InfoContentValue>
            <InfoContentValue
              fontWeight="bold"
              style={{
                marginTop: theme.space[2],
              }}>
              {totalPost}
            </InfoContentValue>
          </Col>
        </InfoContent>
      </Info>
    );
  };

  return (
    <TabAllContainer>
      {renderInfoTag()}
      <RelatedTags searchContent={searchContent} onPressTag={handlePressTag} />
      <RelatedUsers
        searchContent={searchContent}
        onPressSeeMore={onPressSeeMore}
      />
      <RelatedDAO
        searchContent={searchContent}
        onPressSeeMore={onPressSeeMore}
      />
      <RelatedPosts
        searchContent={searchContent}
        onPressSeeMore={onPressSeeMore}
      />
    </TabAllContainer>
  );
};

export default TabAll;

const Col = styled.View(() => ({}));

const InfoContentValue = styled(H5)(({ theme }) => ({
  color: theme.colors.lightGreen,
  marginLeft: theme.space[10],
}));

const InfoContentTitle = styled(H5)(({ theme }) => ({
  color: theme.colors.white,
}));

const InfoContent = styled.View(({ theme }) => ({
  flexDirection: 'row',
}));

const InfoTagTitle = styled(H4)(({ theme }) => ({
  color: theme.colors.white,
  marginBottom: theme.space[4],
}));

const Info = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.black[2],
  borderRadius: theme.borderRadius.medium,
  marginBottom: theme.space[4],
  paddingVertical: theme.space[4],
  paddingHorizontal: theme.horizontalSpace[4],
}));

const TabAllContainer = styled.ScrollView(() => ({}));
