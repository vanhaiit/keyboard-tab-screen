import { Icons } from '@/assets';
import BottomSheet from '@/components/BottomSheet';
import BtnSubmit from '@/components/BtnSubmit';
import { H4, Label } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { ActivityIndicator, Switch } from 'react-native';
interface IProps {
  onChangeClassification: (value: string) => void;
  onChangeInvitation: (value: boolean) => void;
  invitation?: boolean;
  classification?: string;
  loadingType?: boolean;
}
export default function QuickSetting({
  onChangeClassification,
  onChangeInvitation,
  invitation = false,
  classification,
  loadingType = false,
}: IProps) {
  const { colors, space, borderRadius } = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const toggleSwitch = (value: boolean) => {
    onChangeInvitation(value);
  };

  const renderContent = () => {
    return (
      <Box>
        <Option
          onPress={() => onChangeClassification('public')}
          active={classification === 'public'}>
          <Text active={classification === 'public'}>Public</Text>
        </Option>
        <Option
          active={classification === 'private'}
          onPress={() => onChangeClassification('private')}>
          <Text active={classification === 'private'}>Private</Text>
        </Option>
      </Box>
    );
  };

  return (
    <>
      <Row>
        <Left>
          <Title fontWeight="bold">DAO Type</Title>
          <Description>
            Only authorized users can participate in Dao's community activities.
          </Description>
        </Left>
        <Right>
          {classification && (
            <BtnSubmit
              onPress={() => !loadingType && setOpen(true)}
              iconSuffix={
                <>
                  {loadingType ? (
                    <ActivityIndicator size="small" color={colors.black[0]} />
                  ) : (
                    <Icons.ArrowDown color={colors.black[0]} />
                  )}
                </>
              }
              style={{ height: space[8], borderRadius: borderRadius.large }}
              label={
                !loadingType
                  ? classification === 'public'
                    ? 'Public'
                    : 'Private'
                  : ''
              }
            />
          )}
        </Right>
      </Row>
      <Row>
        <Left>
          <Title fontWeight="bold">Invitation</Title>
          <Description>
            Allows authenticated users to invite other users.
          </Description>
        </Left>
        <Right>
          <Switch
            trackColor={{
              false: colors.grey[1],
              true: colors.blackYellow,
            }}
            thumbColor={invitation ? colors.lightGreen : '#f4f3f4'}
            ios_backgroundColor={colors.blackYellow}
            onValueChange={() => toggleSwitch(!invitation)}
            value={invitation}
          />
        </Right>
      </Row>
      <BottomSheet
        isVisible={open}
        title="Select DAO type"
        closeModal={() => setOpen(false)}
        renderContent={renderContent}
        renderFooter={() => <></>}
      />
    </>
  );
}

const Text = styled(H4)<{ active: boolean }>(
  ({ theme: { colors }, active }) => ({
    color: !active ? colors.white : colors.black[0],
  }),
);

const Box = styled.View(() => ({
  // padding: space[4],
}));

const Option = styled.Pressable<{ active: boolean }>(
  ({ theme: { borderRadius, space, colors, horizontalSpace }, active }) => ({
    borderRadius: borderRadius.large,
    height: space[12],
    backgroundColor: active ? colors.lightGreen : colors.black[5],
    marginBottom: space[2],
    flexDirection: 'row',
    gap: horizontalSpace[3],
    alignItems: 'center',
    padding: horizontalSpace[4],
  }),
);

const Title = styled(H4)(({ theme: { colors } }) => ({
  color: colors.white,
}));

const Description = styled(Label)(({ theme: { colors } }) => ({
  color: colors.grey[1],
}));

const Left = styled.View(({ theme: { horizontalSpace } }) => ({
  width: horizontalSpace[56],
  height: '100%',
  alignContent: 'space-between',
  justifyContent: 'space-between',
}));

const Right = styled.View(({ theme: { horizontalSpace, space } }) => ({
  width: horizontalSpace[26],
  height: space[8],
  alignItems: 'flex-end',
}));

const Row = styled.View(({ theme: { space, horizontalSpace } }) => ({
  height: space[15],
  width: horizontalSpace[82],
  flexDirection: 'row',
  marginTop: space[4],
}));
