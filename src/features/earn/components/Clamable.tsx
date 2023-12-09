import Button from '@/components/Button';
import Row from '@/components/Row';
import { H5 } from '@/components/Typography';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import useEarnSummary from '@/hooks/useEarnSummary';

const Container = styled.View(
  ({ theme: { colors, space, horizontalSpace } }) => ({
    backgroundColor: colors.black[2],
    paddingVertical: space[4],
    borderRadius: 10,
    paddingHorizontal: horizontalSpace[4],
    gap: space[4],
  }),
);

const StyledRow = styled(Row)(() => ({
  justifyContent: 'space-between',
}));

const StyledView = styled.View(({ theme: { space } }) => ({
  gap: space[2],
}));

interface Props {}

const Claimable = ({}: Props) => {
  const { colors, space } = useTheme();

  const buttonStyles = useMemo(() => {
    return {
      height: space[10],
      borderRadius: 10,
      backgroundColor: colors.grey[2],
    };
  }, [colors.grey, space]);

  const { calculatedData } = useEarnSummary();

  return (
    <Container>
      <StyledView>
        <StyledRow>
          <H5>Total earned</H5>
          <H5 fontWeight="bold" color={colors.lightGreen}>
            {calculatedData.earned} $INK
          </H5>
        </StyledRow>
        <StyledRow>
          <H5>Claimable</H5>
          <H5 fontWeight="bold" color={colors.lightGreen}>
            {calculatedData.claimable} $INK
          </H5>
        </StyledRow>
      </StyledView>
      <Button
        textColor={colors.grey[1]}
        style={buttonStyles}
        disabled={true}
        text="Claim"
      />
    </Container>
  );
};

export default Claimable;
