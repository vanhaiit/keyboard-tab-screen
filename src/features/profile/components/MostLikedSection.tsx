import { Label } from '@/components/Typography';
import { useTheme } from '@emotion/react';
import styled from '@emotion/native';

import { UserProfile } from '../types';
import SectionContainer from './SectionContainner';

import Empty from '@/components/Empty';
import { ProfileCardItem } from '@/components/ProfileCardItem';

const LabelStyle = styled(Label)(({ theme: { space } }) => ({
  marginBottom: space[2],
}));

const MostLikedSection = ({ data }: { data: UserProfile[] }) => {
  const { colors, space } = useTheme();

  return (
    <SectionContainer>
      <LabelStyle fontWeight="bold" color={colors.lightGreen}>
        Most Liked By
      </LabelStyle>

      {Array.isArray(data) && data.length ? (
        data.map(item => (
          <ProfileCardItem
            key={item.id}
            item={item}
            hideUniqueId
            hideDescription
          />
        ))
      ) : (
        <Empty style={{ marginVertical: space[2] }} />
      )}
    </SectionContainer>
  );
};

export default MostLikedSection;
