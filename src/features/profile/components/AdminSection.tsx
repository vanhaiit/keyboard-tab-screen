import { Label } from '@/components/Typography';
import { useTheme } from '@emotion/react';
import ButtonChip from '../../../components/ButtonChip';
import SectionContainer from './SectionContainner';
import styled from '@emotion/native';
import { DAO } from '../types';
import { useNavigation } from '@react-navigation/native';
import Empty from '@/components/Empty';

const Wrapper = styled.View(({ theme: { space, colors, borderRadius } }) => ({
  marginTop: space[2],
  backgroundColor: colors.black[2],
  borderRadius: borderRadius.small,
  paddingHorizontal: space[4],
  paddingBottom: space[4],
  paddingTop: space[3],
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: space[1],
}));

const AdminSection = ({ data }: { data: DAO[] }) => {
  const { navigate } = useNavigation() as any;
  const { colors, space } = useTheme();
  return (
    <SectionContainer>
      <Label fontWeight="bold" color={colors.lightGreen}>
        Admin
      </Label>
      {Array.isArray(data) && data.length ? (
        <Wrapper>
          {Array.isArray(data) &&
            data.map(item => (
              <ButtonChip
                key={item?.id}
                imageSrc={
                  item?.avatar
                    ? { uri: item?.avatar?.url }
                    : require('@/assets/images/gray-logo.png')
                }
                label={item.name}
                onPress={() => navigate('DetailDAO', { id: item.id })}
              />
            ))}
        </Wrapper>
      ) : (
        <Empty style={{ marginVertical: space[2] }} />
      )}
    </SectionContainer>
  );
};

export default AdminSection;
