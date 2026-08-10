import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  style?: React.CSSProperties;
}

const Skeleton = ({ 
  width, 
  height, 
  borderRadius, 
  className = '', 
  variant = 'text',
  style = {}
}: SkeletonProps) => {
  const inlineStyles = {
    width: width || (variant === 'text' ? '100%' : 'auto'),
    height: height || (variant === 'text' ? '1em' : 'auto'),
    borderRadius: borderRadius || (variant === 'circular' ? '50%' : (variant === 'text' ? '4px' : '8px')),
    ...style
  };

  return (
    <div 
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={inlineStyles}
    />
  );
};

export default Skeleton;
