import WebView, { WebViewProps } from 'react-native-webview';

interface Props extends WebViewProps {
  url: string;
}

const VideoPlayer = ({ url, style }: Props) => {
  return (
    <WebView
      style={style}
      originWhitelist={['*']}
      source={{
        html: `
          <video
            controls
            loop
            autoPlay
            playsInline
            src="${url}"
            style="
              position: absolute; 
              left: 0; 
              top: 0;
              width: 100%; 
              height: 98%;
              object-fit: fill;
              right: 0;
              bottom: 0;
            "
          />`,
      }}
      mediaPlaybackRequiresUserAction
      allowsFullscreenVideo
      allowsInlineMediaPlayback
      androidLayerType="hardware"
      mixedContentMode="always"
    />
  );
};

export default VideoPlayer;
