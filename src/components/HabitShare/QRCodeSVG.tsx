/**
 * QR Code SVG Component
 * Wrapper around react-native-qrcode-svg
 */
import QRCode from 'react-native-qrcode-svg';

interface QRCodeSVGProps {
  value: string;
  size?: number;
}

export function QRCodeSVG({ value, size = 200 }: QRCodeSVGProps) {
  return (
    <QRCode
      value={value}
      size={size}
      backgroundColor="white"
      color="black"
    />
  );
}
