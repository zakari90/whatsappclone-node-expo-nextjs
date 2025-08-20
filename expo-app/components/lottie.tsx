import LottieView from 'lottie-react-native';


export default function Lottie({
  animationData,
  autoPlay = true,
  loop = true,
  style,
}: {
  animationData: any;
  autoPlay?: boolean;
  loop?: boolean;
  style?: object;
}) {
  return (
    <LottieView
      source={animationData}
      autoPlay={autoPlay}
      loop={loop}
      style={style}
    />
  );
}