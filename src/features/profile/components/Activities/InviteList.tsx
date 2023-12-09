import { Icons } from '@/assets';
import Button from '@/components/Button';
import Empty from '@/components/Empty';
import { H4, H5, Label } from '@/components/Typography';
import { colors } from '@/theme/colors';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import FastImage from 'react-native-fast-image';
import {
  useAcceptDaoInviteMutation,
  useRejectDaoInviteMutation,
} from '../../slice/api';
import { InviteData, InviteStatus } from '../../types';
import InviteListSkeleton from './InviteListSkeleton';

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
    height: space[10],
    borderRadius: borderRadius.medium,
    marginRight: space[3],
  }),
);

const RejectBtn = styled(Button)(
  ({ theme: { space, horizontalSpace, borderRadius, colors } }) => ({
    width: horizontalSpace[26],
    height: space[10],
    borderRadius: borderRadius.medium,
    marginRight: space[3],
    backgroundColor: colors.black[2],
    borderColor: colors.grey[1],
    borderWidth: 1,
    color: colors.grey[1],
  }),
);

const Message = styled.View(({ theme: {} }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

const AcceptText = styled(H5)(({ theme: { colors, space } }) => ({
  marginLeft: space[1],
  color: colors.lightGreen,
}));

const RejectText = styled(H5)(({ theme: { colors, space } }) => ({
  marginLeft: space[1],
  color: colors.alertRed,
}));

const RenderItem = ({
  item,
  callBackAction,
}: {
  item: InviteData;
  callBackAction: (id: string, type: InviteStatus) => void;
}) => {
  const [acceptInvite, { isLoading: isAcceptInvite }] =
    useAcceptDaoInviteMutation();

  const [rejectInvite, { isLoading: isRejectInvite }] =
    useRejectDaoInviteMutation();

  const onAccept = async () => {
    try {
      const payload = { inviteId: item?.id };
      await acceptInvite(payload);
      callBackAction && callBackAction(item?.id, InviteStatus.ACCEPTED);
    } catch (err: any) {}
  };

  const onReject = async () => {
    try {
      const payload = { inviteId: item?.id };
      await rejectInvite(payload);
      callBackAction && callBackAction(item?.id, InviteStatus.REJECTED);
    } catch (err: any) {}
  };

  return (
    <Box>
      <FastImageStyle
        source={
          item?.dao?.avatar?.url
            ? { uri: item?.dao?.avatar?.url }
            : require('@/assets/images/gray-logo.png')
        }
      />
      <Content>
        <Title fontWeight="bold">#{item?.dao?.name?.toUpperCase()}</Title>
        <Description fontWeight="medium">
          Invited by {item?.sender?.username}
        </Description>
        {item?.status === InviteStatus.PENDING && (
          <Action>
            <AcceptBtn
              text="Accept"
              loading={isAcceptInvite}
              disabled={isRejectInvite}
              onPress={onAccept}
            />
            <RejectBtn
              text="Reject"
              textColor={colors.grey[1]}
              disabled={isAcceptInvite}
              loading={isRejectInvite}
              onPress={onReject}
            />
          </Action>
        )}
        {item?.status === InviteStatus.ACCEPTED && (
          <Message>
            <Icons.AcceptedIcon />
            <AcceptText fontWeight="medium">
              Accepted in {dayjs(item?.time).format('DD/MM/YYYY')}
            </AcceptText>
          </Message>
        )}
        {item?.status === InviteStatus.REJECTED && (
          <Message>
            <Icons.RejectedIcon />
            <RejectText fontWeight="medium">
              Rejected in {dayjs(item?.time).format('DD/MM/YYYY')}
            </RejectText>
          </Message>
        )}
      </Content>
    </Box>
  );
};

interface IInviteList {
  data: InviteData[];
  isLoading: boolean;
  callBackAction: (id: string, type: InviteStatus) => void;
}

const InviteList = ({ data, isLoading, callBackAction }: IInviteList) => {
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
          renderItem={({ item }: { item: InviteData }) => (
            <RenderItem item={item} callBackAction={callBackAction} />
          )}
        />
      ) : (
        <Empty style={{ flex: 0 }} />
      )}
    </Container>
  );
};

export default InviteList;
