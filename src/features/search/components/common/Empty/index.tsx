import Empty from '@/components/Empty';
import { useTheme } from '@emotion/react';
import React from 'react';

const SearchEmpty: React.FC = () => {
  const theme = useTheme();

  return (
    <Empty
      style={{
        backgroundColor: theme.colors.black[2],
        marginTop: theme.space[2],
      }}
    />
  );
};

export default SearchEmpty;
