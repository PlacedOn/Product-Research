import logoSrc from '../../imports/WhatsApp_Image_2026-04-27_at_23.40.12_1.png';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <img
      src={logoSrc}
      alt="PlacedOn"
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
