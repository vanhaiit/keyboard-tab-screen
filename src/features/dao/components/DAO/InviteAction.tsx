import { Label } from '@/components/Typography';
import { ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { StatusUserDao } from '../../types';
import { useInviteJoinDAOMutation } from '../../slice/api';

interface IInviteAction {
  status?: StatusUserDao | string;
  idDao: string;
  id: string;
}

export const InviteAction = ({ status, idDao, id }: IInviteAction) => {
  const { colors } = useTheme();

  const [isInvite, setIsInvite] = useState<boolean>(
    status === StatusUserDao.PENDING || false,
  );

  const [inviteUser, { isLoading }] = useInviteJoinDAOMutation();

  const handleInvite = async (idUser: string) => {
    try {
      await inviteUser({ id: idDao!, receivers: [idUser] });
      setIsInvite(true);
    } catch (err: any) {}
  };

  return (
    <InviteButton
      isInvite={isInvite}
      disabled={isInvite}
      onPress={() => handleInvite(id)}>
      {isLoading ? (
        <ActivityIndicator size={'small'} animating color={colors.black[0]} />
      ) : (
        <Label
          fontWeight="bold"
          color={isInvite ? colors.grey[1] : colors.black[0]}>
          {isInvite ? 'Inviting' : 'Invite'}
        </Label>
      )}
    </InviteButton>
  );
};

export const InviteButton = styled.TouchableOpacity<{ isInvite: boolean }>(
  ({ theme: { space, colors, styles, borderRadius }, isInvite }) => ({
    ...styles.center,
    backgroundColor: isInvite ? colors.grey[2] : colors.lightGreen,
    paddingHorizontal: space[4],
    paddingVertical: space[2],
    borderRadius: borderRadius.small,
  }),
);
