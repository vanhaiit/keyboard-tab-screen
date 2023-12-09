import { Icons } from '@/assets';
import { H4 } from '@/components/Typography';

import { theme } from '@/theme';
import styled from '@emotion/native';
import React from 'react';

interface Props {
  tagValue: string;
  onPressTag?: () => void;
  onPressRemove?: () => void;
  onPressAdd?: () => void;
  isDisableRemove?: boolean;
  isDisableAdd?: boolean;
}

const TagSearch: React.FC<Props> = ({
  tagValue,
  onPressTag,
  onPressRemove,
  onPressAdd,
  isDisableAdd = false,
  isDisableRemove = false,
}) => {
  const renderRemoveIcon = () => {
    return (
      <TouchableCloseIcon
        onPress={onPressRemove}
        hitSlop={10}
        disabled={isDisableRemove}>
        <CloseIconBackground>
          <Icons.Close width={8} height={8} color={theme.colors.black[2]} />
        </CloseIconBackground>
      </TouchableCloseIcon>
    );
  };

  const renderAddIcon = () => {
    return (
      <TouchableCloseIcon
        onPress={onPressAdd}
        hitSlop={10}
        disabled={isDisableAdd}>
        <Icons.PlusIc width={20} height={20} color={theme.colors.lightGreen} />
      </TouchableCloseIcon>
    );
  };

  return (
    <TagItem onPress={onPressTag}>
      <TagName numberOfLines={1} fontWeight="bold">
        {tagValue}
      </TagName>
      {onPressRemove ? renderRemoveIcon() : renderAddIcon()}
    </TagItem>
  );
};

export default TagSearch;

const CloseIconBackground = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.grey[1],
  borderRadius: theme.borderRadius.full,
  width: 14,
  height: 14,
  justifyContent: 'center',
  alignItems: 'center',
}));

const TouchableCloseIcon = styled.TouchableOpacity(({ theme }) => ({}));

const TagName = styled(H4)(({ theme }) => ({
  color: theme.colors.white,
  marginRight: theme.space[2],
  maxWidth:
    theme.window.width -
    2 * theme.space[4] -
    2 * theme.space[3] -
    14 -
    theme.space[2],
}));

const TagItem = styled.Pressable(({ theme }) => ({
  paddingHorizontal: theme.horizontalSpace[3],
  paddingVertical: theme.space[3],
  backgroundColor: theme.colors.black[2],
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: theme.borderRadius.medium,
  marginRight: theme.space[3],
  marginTop: theme.space[2],
}));
