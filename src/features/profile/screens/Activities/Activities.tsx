import { Icons } from '@/assets';
import styled from '@emotion/native';
import { H4 } from '@/components/Typography';
import { FlashList } from '@shopify/flash-list';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { AppRootParams } from '@/navigations/types';
import { ActivityScreen } from '../../types';
import { getUserInfo } from '@/features/auth/slice/selectors';
import { useAppSelector } from '@/store/type';
import Header from '@/components/Header';
import { useTheme } from '@emotion/react';
import { useGetProfileInfoQuery } from '../../slice/api';

interface IItem {
  icon: any;
  label: string;
  value: ActivityScreen;
  isShow: boolean;
}

interface IItemProp {
  item: IItem;
  onClick: (active: ActivityScreen) => void;
}

const Item = ({ item, onClick }: IItemProp) => {
  return (
    <ItemWarper onPress={() => onClick(item?.value)}>
      {item?.icon}
      <TitleItem fontWeight="bold">{item?.label}</TitleItem>
    </ItemWarper>
  );
};

const IconBox = styled.View(({ theme: { horizontalSpace, colors } }) => ({
  width: horizontalSpace[6],
  height: horizontalSpace[6],
  color: colors.white,
}));

export default function ActivitiesScreen() {
  const { params } = useRoute<RouteProp<AppRootParams, 'Activities'>>();

  const userInfo = useAppSelector(getUserInfo);

  const profileId = params?.profileId || '';

  const isMyProFile = userInfo?.profile?.id === profileId;

  const { navigate } =
    useNavigation<NavigationProp<AppRootParams, 'Activities'>>();

  const { data: dataUser } = useGetProfileInfoQuery(profileId, {
    skip: !profileId,
  });

  const { colors } = useTheme();

  const data = [
    {
      icon: <Icons.PostIcon />,
      label: 'Post',
      value: ActivityScreen.POST,
      isShow: true,
    },
    {
      icon: (
        <IconBox>
          <Icons.CommentsIcon2 color={colors.white} />
        </IconBox>
      ),
      label: 'Comments',
      value: ActivityScreen.COMMENTS,
      isShow: true,
    },
    {
      icon: <Icons.LikesIcon2 />,
      label: 'Likes',
      value: ActivityScreen.LIKES,
      isShow: true,
    },
    {
      icon: <Icons.BookMarkIcon2 />,
      label: 'Bookmark',
      value: ActivityScreen.BOOKMARK,
      isShow: isMyProFile,
    },
    {
      icon: (
        <IconBox>
          <Icons.DraftIcon color={colors.white} />
        </IconBox>
      ),
      label: 'Drafts',
      value: ActivityScreen.DRAFTS,
      isShow: isMyProFile,
    },
    {
      icon: <Icons.InviteIcon color={colors.white} />,
      label: 'Invite',
      value: ActivityScreen.INVITE,
      isShow: isMyProFile,
    },
  ];

  const handleClickItem = (active: string) => {
    navigate('ActiveActivity', {
      profileId: profileId,
      active,
    });
  };

  return (
    <Container>
      <Header
        title={`${
          dataUser ? dataUser?.username : userInfo?.profile?.username
        } activities`}
        hideHeaderLeft={false}
      />
      <Body>
        <FlashList
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={_ => _.value.toString()}
          estimatedItemSize={200}
          renderItem={({ item }: { item: IItem }) => {
            if (item?.isShow) {
              return <Item item={item} onClick={handleClickItem} />;
            } else {
              return null;
            }
          }}
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

const TitleItem = styled(H4)(({ theme: { colors, space } }) => ({
  color: colors.white,
  marginLeft: space[2],
}));

const ItemWarper = styled.TouchableOpacity(
  ({ theme: { space, horizontalSpace, colors, borderRadius } }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: horizontalSpace[4],
    paddingVertical: space[3],
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.medium,
    marginTop: space[3],
  }),
);
