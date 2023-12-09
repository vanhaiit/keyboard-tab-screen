import Loading from '@/components/Loading';
import { Label } from '@/components/Typography';
import {
  useFollowTagMutation,
  useUnFollowTagMutation,
} from '@/features/profile/slice/api';
import styled from '@emotion/native';
import React from 'react';
import { useGetSearchForumQuery } from '../../slice/api';
import { ISearchTags } from '../../types';
import SearchEmpty from '../common/Empty';
import TagSearch from '../common/Tag';

const MAX_RECORD_RELATED_TAGS = 10;

interface Props {
  searchContent: string;
  onPressTag?: (tagValue: string) => void;
}

const RelatedTags: React.FC<Props> = ({ searchContent, onPressTag }) => {
  const { data: searchForumData, isFetching } = useGetSearchForumQuery({
    text: searchContent,
    _limit: MAX_RECORD_RELATED_TAGS,
  });
  const [followTag, { isLoading: isFollowing }] = useFollowTagMutation();

  const [unFollowTag, { isLoading: isUnFollowing }] = useUnFollowTagMutation();

  const searchForumDataList = searchForumData || [];

  const renderTagList = () => {
    if (isFetching && searchForumDataList.length <= 0) {
      return <Loading />;
    }

    if (searchForumDataList.length <= 0) {
      return <SearchEmpty />;
    }

    const renderTagItem = () => {
      if (searchForumDataList) {
        return searchForumDataList?.map((item: ISearchTags, i) => {
          return (
            <TagSearch
              key={i}
              onPressTag={() => onPressTag?.(item.content)}
              tagValue={item.content}
              onPressRemove={
                item.isFollowing
                  ? () => {
                      unFollowTag({ tag: item._id });
                    }
                  : undefined
              }
              onPressAdd={
                !item.isFollowing
                  ? () => {
                      followTag({ tag: item._id });
                    }
                  : undefined
              }
              isDisableAdd={isFollowing || isFetching}
              isDisableRemove={isUnFollowing || isFetching}
            />
          );
        });
      }
    };

    return <TagList>{renderTagItem()}</TagList>;
  };

  return (
    <RelatedTagsContainer>
      <Title fontWeight="bold">Related Tags</Title>
      <Content>{renderTagList()}</Content>
    </RelatedTagsContainer>
  );
};

export default RelatedTags;

const TagList = styled.View(() => ({
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

const Content = styled.View(({ theme }) => ({}));

const Title = styled(Label)(({ theme }) => ({
  color: theme.colors.lightGreen,
}));

const RelatedTagsContainer = styled.View(({ theme }) => ({
  marginBottom: theme.space[4],
}));
