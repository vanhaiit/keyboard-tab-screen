import styled from '@emotion/native';
import CustomTabs from '@/features/nft/components/TabsBarCustom';
import FollowWrapper from '../components/FollowWrapper';
import TagsWrapper from '../components/TagWrapper';
import DAOWrapper from '../components/DAOWrapper';
import { useAppSelector } from '@/store/type';
import { getUserInfo } from '@/features/auth/slice/selectors';
import {
  useGetListDAOQuery,
  useGetListFollowQuery,
  useGetListTagQuery,
} from '../slice/api';
import { AppRootParams } from '@/navigations/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import InputSearch from '../components/InputSearch';
import { useCallback, useEffect, useState } from 'react';
import { DAOData, FollowData, TagData } from '../types';
import { useGetProfileInfoQuery } from '@/features/profile/slice/api';
import Header from '@/components/Header';

const filterFollow = (
  data: FollowData[],
  text: string,
  isFollower?: boolean,
) => {
  let arr;
  if (isFollower) {
    arr = data?.filter((el: FollowData) =>
      el?.follower?.username
        ?.toLowerCase()
        ?.includes(text?.toLowerCase().trim()),
    );
  } else {
    arr = data?.filter((el: FollowData) =>
      el?.follow?.username?.toLowerCase()?.includes(text?.toLowerCase().trim()),
    );
  }

  return arr;
};

const filterTags = (data: TagData[], text: string) => {
  const arr = data?.filter((el: TagData) =>
    el?.tag?.content?.toLowerCase()?.includes(text?.toLowerCase().trim()),
  );
  return arr;
};

const filterDAO = (data: DAOData[], text: string) => {
  const arr = data?.filter((el: DAOData) =>
    el?.dao?.name?.toLowerCase()?.includes(text?.toLowerCase().trim()),
  );
  return arr;
};

export default function FollowingScreen() {
  const { params } = useRoute<RouteProp<AppRootParams, 'Following'>>();

  const userInfo = useAppSelector(getUserInfo);

  const profileId = params?.profileId || userInfo?.profile?._id || '';

  const [searchText, setSearchText] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string | number>(
    params?.tab || 1,
  );
  const [contTag, setCountTag] = useState<number>(0);

  const [dataFilter, setDataFilter] = useState<
    FollowData[] | TagData[] | DAOData[]
  >([]);

  const { data: dataFollower, isLoading: isLoadingFollower } =
    useGetListFollowQuery({
      _sort: 'createdAt:DESC',
      _limit: -1,
      _start: 0,
      follow: profileId,
    });

  const { data: dataFollowing, isLoading: isLoadingFollowing } =
    useGetListFollowQuery({
      _sort: 'createdAt:DESC',
      _limit: -1,
      _start: 0,
      follower: profileId,
    });

  const { data: dataTags, isLoading: isLoadingTag } = useGetListTagQuery({
    _sort: 'createdAt:DESC',
    _limit: -1,
    _start: 0,
    follower: profileId,
  });

  const { data: dataDAO, isLoading: isLoadingDAO } = useGetListDAOQuery({
    _sort: 'createdAt:DESC',
    _limit: -1,
    _start: 0,
    profile: profileId,
  });

  const { data: dataProfile } = useGetProfileInfoQuery(profileId);

  useEffect(() => {
    getDataSearch(searchText, selectedTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, selectedTab, dataFollower, dataTags, dataDAO]);

  useEffect(() => {
    setCountTag(dataProfile?.totalTagFollowings || 0);
  }, [dataProfile]);

  const getDataSearch = useCallback(
    (searchText: string, selectedTab: number | string) => {
      switch (selectedTab) {
        case 1:
          setDataFilter(filterFollow(dataFollower || [], searchText, true));
          return;
        case 2:
          setDataFilter(
            filterFollow(
              dataFollowing as FollowData[],
              searchText,
              false,
            ) as any,
          );
          return;
        case 3:
          setDataFilter(filterTags(dataTags || [], searchText));
          return;
        case 4:
          setDataFilter(filterDAO(dataDAO || [], searchText));
          return;
        default:
          return;
      }
    },
    [dataDAO, dataFollower, dataFollowing, dataTags],
  );

  const handleChangeSearch = (e: string) => {
    setSearchText(e);
  };

  const handleTabChange = useCallback((value: number | string) => {
    setSearchText('');
    setSelectedTab(value);
  }, []);

  const handleCallBackIsFollowTag = (isFollow: boolean) => {
    if (isFollow && profileId === userInfo?.profile?._id) {
      setCountTag(prev => prev + 1);
    }
    if (!isFollow && profileId === userInfo?.profile?._id) {
      setCountTag(prev => prev - 1);
    }
  };

  return (
    <Container>
      <Header title="Following" hideHeaderLeft={false} />
      <Body>
        <InputSearch value={searchText} handleChange={handleChangeSearch} />
        <CustomTabs
          tabActive={selectedTab}
          onChangeTab={handleTabChange}
          customStyle={{ justifyContent: 'space-between' }}
          data={[
            {
              label: `${dataFollower?.length || 0} ${
                dataFollower?.length || 0 <= 1 ? 'Follower' : 'Followers'
              }`,
              content: (
                <FollowWrapper
                  data={dataFilter as FollowData[]}
                  isFollower
                  isLoading={isLoadingFollower}
                />
              ),
            },
            {
              label: `${dataFollowing?.length || 0} Following`,
              content: (
                <FollowWrapper
                  data={dataFilter as FollowData[]}
                  isLoading={isLoadingFollowing}
                />
              ),
            },
            {
              label: `${contTag} Tags`,
              content: (
                <TagsWrapper
                  data={dataFilter as TagData[]}
                  isLoading={isLoadingTag}
                  onCallBackIsFollow={handleCallBackIsFollowTag}
                />
              ),
            },
            {
              label: `${dataProfile?.totalDaoFollowings || 0} DAO`,
              content: (
                <DAOWrapper
                  data={dataFilter as DAOData[]}
                  isLoading={isLoadingDAO}
                />
              ),
            },
          ]}
        />
      </Body>
    </Container>
  );
}

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.black[4],
  flex: 1,
}));

const Body = styled.View(({ theme }) => ({
  flex: 1,
  paddingHorizontal: theme.space[4],
}));
