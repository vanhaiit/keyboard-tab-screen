import Button from '@/components/Button';
import Empty from '@/components/Empty';
import { H4, Label } from '@/components/Typography';
import InviteListSkeleton from '@/features/profile/components/Activities/InviteListSkeleton';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FlashList } from '@shopify/flash-list';
import { useMemo, useState } from 'react';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-toast-message';
import { useActionJoinDaoRequestMutation } from '../../slice/api';
import { IUserDAO } from '../../types';

const RenderItem = ({
  item,
  callBackAction,
}: {
  item: IUserDAO;
  callBackAction?: (id: string) => void;
}) => {
  const { colors } = useTheme();
  const [action, setAction] = useState('');

  const [actionJoinDao, { isLoading }] = useActionJoinDaoRequestMutation();

  const onAction = async (value: string) => {
    try {
      setAction(value);
      await actionJoinDao({
        id: item?.dao?.id,
        requestId: item?.id,
        prefix:
          value === 'reject'
            ? 'reject-join-dao-request'
            : 'approve-join-dao-request',
      });
      callBackAction && callBackAction(item?.id);
      Toast.show({
        type: '_success',
        text1: 'Success',
        text2:
          value === 'reject'
            ? 'Member request rejected'
            : 'Member request accepted',
        position: 'bottom',
      });
    } catch (err: any) {
    } finally {
      setAction('');
    }
  };

  return (
    <Box>
      <FastImageStyle
        source={
          item?.profile?.avatar?.url
            ? { uri: item?.profile?.avatar?.url }
            : require('@/assets/images/gray-logo.png')
        }
      />
      <Content>
        <Title fontWeight="bold">{item?.profile?.username}</Title>
        <Description fontWeight="medium">
          @{item?.profile?.unique_id}
        </Description>
        <Action>
          <AcceptBtn
            text="Accept"
            disabled={isLoading}
            loading={isLoading && action === 'accept'}
            onPress={() => onAction('accept')}
          />
          <RejectBtn
            text="Reject"
            textColor={colors.grey[1]}
            disabled={isLoading}
            loading={isLoading && action === 'reject'}
            onPress={() => onAction('reject')}
          />
        </Action>
      </Content>
    </Box>
  );
};

const ListMembersRequest = ({
  data,
  isLoading,
  callBackAction,
}: {
  data?: IUserDAO[];
  isLoading: boolean;
  callBackAction?: (id: string) => void;
}) => {
  const { space } = useTheme();

  const styles = useMemo(() => {
    return {
      paddingBottom: space[6],
    };
  }, [space]);

  return (
    <Container>
      {isLoading ? (
        <InviteListSkeleton />
      ) : data && data?.length > 0 ? (
        <FlashList
          contentContainerStyle={styles}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={_ => _.id.toString()}
          estimatedItemSize={200}
          renderItem={({ item }: { item: IUserDAO }) => (
            <RenderItem item={item} callBackAction={callBackAction} />
          )}
        />
      ) : (
        <EmptyBox />
      )}
    </Container>
  );
};

export default ListMembersRequest;

const EmptyBox = styled(Empty)(({ theme: { space } }) => ({
  flex: 0,
  marginTop: space[4],
}));

const Container = styled.View(({ theme: { space } }) => ({
  flex: 1,
  paddingTop: space[1],
}));

const Box = styled.View(({ theme: { space, colors, borderRadius } }) => ({
  flexDirection: 'row',
  backgroundColor: colors.black[2],
  padding: space[4],
  borderRadius: borderRadius.medium,
  marginTop: space[2],
}));

const FastImageStyle = styled(FastImage)(
  ({ theme: { space, borderRadius } }) => ({
    width: space[10],
    height: space[10],
    borderRadius: borderRadius.full,
    marginRight: space[2],
  }),
);

const Content = styled.View(({ theme: { space } }) => ({
  flex: 1,
  marginLeft: space[1],
}));

const Title = styled(H4)(({ theme: { space, colors } }) => ({
  color: colors.white,
  marginBottom: space[1],
}));
const Description = styled(Label)(({ theme: { space, colors } }) => ({
  marginBottom: space[3],
  color: colors.grey[1],
}));

const Action = styled.View(({ theme: {} }) => ({
  flexDirection: 'row',
}));

const AcceptBtn = styled(Button)(
  ({ theme: { space, horizontalSpace, borderRadius } }) => ({
    width: horizontalSpace[26],
    height: space[9],
    borderRadius: borderRadius.medium,
    marginRight: space[3],
  }),
);

const RejectBtn = styled(Button)(
  ({ theme: { space, horizontalSpace, borderRadius, colors } }) => ({
    width: horizontalSpace[26],
    height: space[9],
    borderRadius: borderRadius.medium,
    marginRight: space[3],
    backgroundColor: colors.black[2],
    borderColor: colors.grey[1],
    borderWidth: 1,
    color: colors.grey[1],
  }),
);
