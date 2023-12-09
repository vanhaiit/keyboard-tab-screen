import { TabLabel } from '@/components/TabIcon';
import { getUserInfo } from '@/features/auth/slice/selectors';
import Avatar from '@/features/profile/components/Avatar';
import { useAppSelector } from '@/store/type';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const Container = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

const MyInfoTab = ({ focused }: { focused: boolean }) => {
  const userInfo = useAppSelector(getUserInfo);
  const { space } = useTheme();
  return (
    <Container>
      {userInfo?.profile && (
        <Avatar
          profile={userInfo.profile}
          style={{
            height: space[6],
            width: space[6],
          }}
          resizeMode="cover"
        />
      )}

      <TabLabel active={focused}>My info</TabLabel>
    </Container>
  );
};

export default MyInfoTab;
