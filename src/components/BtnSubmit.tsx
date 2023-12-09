import styled from '@emotion/native';
import { LargeLabel } from './Typography';
import { ReactNode } from 'react';

interface Props {
  onPress?: () => void;
  label?: string;
  iconPrefix?: ReactNode;
  iconSuffix?: ReactNode;
  disable?: boolean;
  bg?: string;
  styleLabel?: any;
  style?: any;
}

const BtnSubmit = ({
  onPress,
  label,
  iconPrefix,
  iconSuffix,
  disable = false,
  styleLabel,
  style,
  bg,
}: Props) => {
  return (
    <Btn
      bg={bg}
      disable={disable}
      style={style}
      onPress={() => !disable && onPress && onPress()}>
      {iconPrefix}
      <Txt fontWeight={styleLabel?.fontWeight || 'bold'} style={styleLabel}>
        {label}
      </Txt>
      {iconSuffix}
    </Btn>
  );
};

export default BtnSubmit;

const Txt = styled(LargeLabel)<{ cl?: string }>(
  ({ theme: { colors, space }, cl }) => ({
    color: cl || colors.black[0],
    paddingRight: space[2],
    paddingLeft: space[2],
  }),
);

const Btn = styled.Pressable<{ disable: boolean; bg?: string }>(
  ({ theme: { space, colors, borderRadius }, disable, bg }) => ({
    height: space[12],
    backgroundColor: disable ? colors.grey[1] : bg || colors.lightGreen,
    marginBottom: space[8],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    width: '100%',
  }),
);
