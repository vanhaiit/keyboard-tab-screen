import { Icons } from '@/assets';
import CheckBox from '@/components/CheckBox';
import Header from '@/components/Header';
import { LargeLabel, Label } from '@/components/Typography';
import { colors } from '@/theme/colors';
import styled from '@emotion/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import Clipboard from '@react-native-clipboard/clipboard';
import debounce from 'lodash/debounce';

import {
  useDeleteInviteLinkMutation,
  useGenerateInviteLinkMutation,
  useGetListUserInviteQuery,
} from '../slice/api';
import { TimeInvitation } from '../types';
import dayjs from 'dayjs';
import useInfiniteQuery from '@/hooks/useInfiniteQuery';
import InputSearch from '@/features/following/components/InputSearch';
import { UserProfile } from '@/features/profile/types';
import ListInviteUser from '../components/DAO/ListInviteUser';
import { CommonActions } from '@react-navigation/native';

type RootStackParamList = {
  InviteDAO: any;
};

type Props = NativeStackScreenProps<RootStackParamList, 'InviteDAO'>;

const endPoint = 'https://dev-alpha.netlify.app/invite-link/';

const InviteDAO = ({ navigation, route }: Props) => {
  const { id } = route.params as any;

  const [timeInvite, setTimeInvite] = useState<TimeInvitation>(
    TimeInvitation.NO_LIMIT,
  );

  const [linkInvite, setLinkInvite] = useState<string>('');
  const [tabActive, setTabActive] = useState<string>('link');
  const [value, setValue] = useState<string>('');
  const [valueDB, setValueDB] = useState<string>('');

  const [generateLink, { data, isLoading }] = useGenerateInviteLinkMutation();
  const [deleteLink, { isLoading: isLoadingDelete }] =
    useDeleteInviteLinkMutation();

  const {
    combinedData: dataUser,
    isLoading: isLoadingUser,
    isFetching: isFetchingUser,
    refreshing: isRefreshingUser,
    loadMore: loadMoreUser,
    refresh: refreshUser,
  } = useInfiniteQuery({
    useGetDataListQuery: useGetListUserInviteQuery,
    params: {
      id: id,
      _sort: 'createdAt:desc',
      _limit: 20,
      unique_id_contains: valueDB?.trim().toLowerCase(),
    },
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    generateInvite(TimeInvitation.NO_LIMIT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data) return;
    setLinkInvite(`${endPoint}${data?.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const copyProfileLink = () => {
    Clipboard.setString(`${linkInvite}`);
    Toast.show({
      type: '_success',
      text1: 'Success',
      text2: 'Link copied to clipboard',
      position: 'bottom',
    });
  };

  const generateInvite = (type: TimeInvitation) => {
    setTimeInvite(type);
    let expiredTime;
    switch (type) {
      case TimeInvitation.NO_LIMIT:
        expiredTime = dayjs().add(99, 'day').toISOString();
        break;
      case TimeInvitation['1_DAY']:
        expiredTime = dayjs().add(1, 'day').toISOString();
        break;
      case TimeInvitation['1_HOUR']:
        expiredTime = dayjs().add(1, 'hour').toISOString();
        break;
      case TimeInvitation['1_WEEK']:
        expiredTime = dayjs().add(7, 'day').toISOString();
        break;
      default:
    }
    deleteLink({ inviteLinkId: data?.id });
    generateLink({
      id: id,
      expiredTime,
      name: '',
    });
  };

  const handleSearch = (e: string) => {
    setValue(e);
    reset(e);
  };

  const reset = debounce((e: string) => {
    setValueDB(e);
    refreshUser();
  }, 800);

  const handleBack = () => {
    if (tabActive === 'link') {
      navigation.dispatch(CommonActions.goBack());
    } else {
      setTabActive('link');
    }
  };

  return (
    <Container>
      <Header
        title="Invite"
        hideHeaderLeft={false}
        onPressBackButton={handleBack}
      />
      {tabActive === 'link' ? (
        <Content>
          <BoxCopy>
            <Link>
              {isLoading || isLoadingDelete ? (
                <ActivityIndicator size={'small'} color={colors.white} />
              ) : (
                <LargeLabel numberOfLines={1}>{linkInvite}</LargeLabel>
              )}
            </Link>
            <BtnCopy onPress={copyProfileLink}>
              <Icons.Copy width={24} height={24} color={colors.lightGreen} />
            </BtnCopy>
          </BoxCopy>
          <Line />
          <LargeLabel fontWeight="bold">Choose an invitation period</LargeLabel>
          <Description>
            Only authorized users can participate in Dao's community activities.
          </Description>
          <CheckBoxContainer>
            <CheckBoxStyle
              onPress={() => generateInvite(TimeInvitation.NO_LIMIT)}
              label="No limit invitation"
              isCircle
              mode="radio"
              fontWeight="bold"
              checked={timeInvite === TimeInvitation.NO_LIMIT}
              disabled={isLoading}
            />
            <CheckBoxStyle
              onPress={() => generateInvite(TimeInvitation['1_HOUR'])}
              label="1 hour invitation"
              isCircle
              mode="radio"
              fontWeight="bold"
              checked={timeInvite === TimeInvitation['1_HOUR']}
              disabled={isLoading}
            />
            <CheckBoxStyle
              onPress={() => generateInvite(TimeInvitation['1_DAY'])}
              label="1 day invitation"
              isCircle
              mode="radio"
              fontWeight="bold"
              checked={timeInvite === TimeInvitation['1_DAY']}
              disabled={isLoading}
            />
            <CheckBoxStyle
              onPress={() => generateInvite(TimeInvitation['1_WEEK'])}
              label="1 Week invitation"
              isCircle
              mode="radio"
              fontWeight="bold"
              checked={timeInvite === TimeInvitation['1_WEEK']}
              disabled={isLoading}
            />
          </CheckBoxContainer>
          <Line />
          <InviteUser onPress={() => setTabActive('user')}>
            <Icons.UserIcon color={colors.white} />
            <LargeLabelStyle>Invite user</LargeLabelStyle>
          </InviteUser>
        </Content>
      ) : (
        <Content>
          <InputSearch handleChange={handleSearch} value={value} />
          <ListInviteUser
            data={dataUser as UserProfile[]}
            loadMore={loadMoreUser}
            isLoading={isLoadingUser || isRefreshingUser}
            isFetching={isFetchingUser}
            id={id}
          />
        </Content>
      )}
    </Container>
  );
};

const Container = styled.View(({ theme: { colors } }) => ({
  backgroundColor: colors.black[3],
  flex: 1,
}));

const Content = styled.View(({ theme: { horizontalSpace, space } }) => ({
  paddingHorizontal: horizontalSpace[4],
  paddingVertical: space[4],
  flex: 1,
}));

const BoxCopy = styled.View(({ theme: {} }) => ({
  flexDirection: 'row',
}));

const BtnCopy = styled.TouchableOpacity(
  ({ theme: { colors, space, borderRadius } }) => ({
    backgroundColor: colors.black[2],
    width: space[12],
    height: space[12],
    borderRadius: borderRadius.medium,
    marginLeft: space[2],
    alignItems: 'center',
    justifyContent: 'center',
  }),
);

const Link = styled.View(
  ({ theme: { colors, space, borderRadius, horizontalSpace } }) => ({
    paddingHorizontal: horizontalSpace[4],
    height: space[12],
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }),
);

const Line = styled.View(({ theme: { colors, space } }) => ({
  width: '100%',
  height: 1,
  backgroundColor: colors.palette.whiteTransparent[1],
  marginVertical: space[6],
}));

const Description = styled(Label)(({ theme: { colors, space } }) => ({
  marginVertical: space[2],
  color: colors.grey[1],
}));

const InviteUser = styled.TouchableOpacity(
  ({ theme: { colors, space, borderRadius, horizontalSpace } }) => ({
    backgroundColor: colors.black[2],
    paddingHorizontal: horizontalSpace[5],
    height: space[12],
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    flexDirection: 'row',
  }),
);

const LargeLabelStyle = styled(LargeLabel)(({ theme: { space } }) => ({
  marginLeft: space[2],
}));

const CheckBoxContainer = styled.View(() => ({}));

const CheckBoxStyle = styled(CheckBox)(({ theme: { space } }) => ({
  marginTop: space[3],
}));

export default InviteDAO;
