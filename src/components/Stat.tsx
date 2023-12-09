import styled from '@emotion/native';
import { H2, Label } from './Typography';

interface IStat {
  isLast?: boolean;
  label: string;
  value: string | number;
  onClick?: () => void;
}

const StatLabel = styled(Label)(({ theme: { colors, space } }) => ({
  color: colors.grey[1],
  paddingTop: space[1],
}));

const VerticalDivider = styled.View(({ theme: { colors, space } }) => ({
  height: space[6],
  width: 1,
  backgroundColor: colors.whiteTransparent[1],
}));

const Row = styled.TouchableOpacity(() => ({
  flex: 1,
  justifyContent: 'space-between',
  flexDirection: 'row',
}));

const Box = styled.View(() => ({
  flex: 1,
  alignItems: 'center',
}));

const Stat = ({ isLast, label, value, onClick }: IStat) => {
  return (
    <Row onPress={onClick}>
      <Box>
        <H2 fontWeight="bold">{value}</H2>
        <StatLabel>{label}</StatLabel>
      </Box>
      {!isLast && <VerticalDivider />}
    </Row>
  );
};

export default Stat;
