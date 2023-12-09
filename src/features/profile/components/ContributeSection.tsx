import { Label } from '@/components/Typography';
import { useTheme } from '@emotion/react';

import ButtonChip from '../../../components/ButtonChip';
import SectionContainer from './SectionContainner';
import styled from '@emotion/native';
import { DAOUser } from '../types';
import Empty from '@/components/Empty';
import { useNavigation } from '@react-navigation/native';

const Wrapper = styled.View(({ theme: { space, colors, borderRadius } }) => ({
  marginTop: space[2],
  backgroundColor: colors.black[2],
  borderRadius: borderRadius.small,
  paddingHorizontal: space[4],
  paddingBottom: space[4],
  paddingTop: space[3],
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

const ContributeSection = ({ data }: { data: DAOUser[] }) => {
  const { navigate } = useNavigation() as any;
  const { colors, space } = useTheme();
  return (
    <SectionContainer>
      <Label fontWeight="bold" color={colors.lightGreen}>
        Contribute
      </Label>

      {Array.isArray(data) && data.length ? (
        <Wrapper>
          {Array.isArray(data) &&
            data.map(item => (
              <ButtonChip
                key={item.id}
                imageSrc={
                  item?.dao?.avatar
                    ? { uri: item?.dao?.avatar?.url }
                    : require('@/assets/images/gray-logo.png')
                }
                label={item?.dao?.name}
                onPress={() => navigate('DetailDAO', { id: item?.dao?.id })}
              />
            ))}
        </Wrapper>
      ) : (
        <Empty style={{ marginVertical: space[2] }} />
      )}
    </SectionContainer>
  );
};

export default ContributeSection;
