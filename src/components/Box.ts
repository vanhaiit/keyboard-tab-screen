import styled from '@emotion/native';

export const Box = styled.View(
  ({ theme: { space, colors, borderRadius } }) => ({
    backgroundColor: colors.black[2],
    borderRadius: borderRadius.small,
    marginBottom: space[4],
    padding: space[4],
  }),
);
