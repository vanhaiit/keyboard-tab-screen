import { Dispatch, SetStateAction } from 'react';
import {
  Animated,
  GestureResponderHandlers,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import type { VideoAnimations } from '../types';
import { calculateTime } from '../utils';
import { Fullscreen } from './Fullscreen';
import { NullControl } from './NullControl';
import { Seekbar } from './Seekbar';
import { styles } from './styles';
import { Timer } from './Timer';
import { Title } from './Title';
import { Volume } from './Volume';

interface BottomControlsProps {
  showControls: boolean;
  animations: VideoAnimations;
  panHandlers: GestureResponderHandlers;
  disableTimer: boolean;
  disableSeekbar: boolean;
  showDuration: boolean;
  showHours: boolean;
  paused: boolean;
  showTimeRemaining: boolean;
  currentTime: number;
  duration: number;
  seekColor: string;
  title: string;
  toggleTimer: () => void;
  resetControlTimeout: () => void;
  seekerFillWidth: number;
  seekerPosition: number;
  setSeekerWidth: Dispatch<SetStateAction<number>>;
  isFullscreen: boolean;
  disableFullscreen: boolean;
  toggleFullscreen: () => void;
  disableVolume: boolean;
  muted: boolean;
  setMuted: () => void;
}

export const BottomControls = ({
  showControls,
  animations,
  panHandlers,
  disableSeekbar,
  disableTimer,
  duration,
  seekColor,
  showDuration,
  showHours,
  showTimeRemaining,
  currentTime,
  title,
  toggleTimer,
  resetControlTimeout,
  seekerFillWidth,
  seekerPosition,
  setSeekerWidth,
  isFullscreen,
  disableFullscreen,
  toggleFullscreen,
  disableVolume,
  muted,
  setMuted,
}: BottomControlsProps) => {
  const timerControl = disableTimer ? (
    <NullControl />
  ) : (
    <Timer
      resetControlTimeout={resetControlTimeout}
      toggleTimer={toggleTimer}
      showControls={showControls}>
      {calculateTime({
        showDuration,
        showHours,
        showTimeRemaining,
        time: currentTime,
        duration,
      })}
    </Timer>
  );

  const seekbarControl = disableSeekbar ? (
    <NullControl />
  ) : (
    <Seekbar
      seekerFillWidth={seekerFillWidth}
      seekerPosition={seekerPosition}
      seekColor={seekColor}
      seekerPanHandlers={panHandlers}
      setSeekerWidth={setSeekerWidth}
    />
  );

  const fullscreenControl = disableFullscreen ? (
    <NullControl />
  ) : (
    <Fullscreen
      isFullscreen={isFullscreen}
      toggleFullscreen={toggleFullscreen}
      resetControlTimeout={resetControlTimeout}
      showControls={showControls}
    />
  );

  const volumeControl = disableVolume ? (
    <NullControl />
  ) : (
    <Volume isVolumeOn={!muted} toggleVolume={setMuted} />
  );

  return (
    <Animated.View
      style={[
        _styles.bottom,
        {
          opacity: animations.controlsOpacity,
          marginBottom: animations.bottomControl.marginBottom,
        },
      ]}>
      <ImageBackground
        source={require('../assets/img/bottom-vignette.png')}
        style={[styles.column]}
        imageStyle={[styles.vignette]}>
        <SafeAreaView style={[styles.row, _styles.bottomControlGroup]}>
          {timerControl}
          <Title title={title} />
          <View style={_styles.volume}>
            {volumeControl}
            {fullscreenControl}
          </View>
        </SafeAreaView>
        <SafeAreaView style={styles.seekBarContainer}>
          {seekbarControl}
        </SafeAreaView>
      </ImageBackground>
    </Animated.View>
  );
};

const _styles = StyleSheet.create({
  bottom: {
    alignItems: 'stretch',
    flex: 2,
    justifyContent: 'flex-end',
  },
  bottomControlGroup: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 0,
  },
  volume: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
