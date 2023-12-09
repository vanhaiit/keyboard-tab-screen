import { Icons } from '@/assets';
import React from 'react';
import { View } from 'react-native';
import { Control } from '../Control';

interface VolumeProps {
  isVolumeOn: boolean;
  toggleVolume: () => void;
}

export const Volume = ({ isVolumeOn, toggleVolume }: VolumeProps) => {
  return (
    <Control callback={toggleVolume}>
      <View>{isVolumeOn ? <Icons.VolumeOn /> : <Icons.VolumeOff />}</View>
    </Control>
  );
};
