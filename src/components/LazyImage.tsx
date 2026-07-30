type LazyImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Mark true only for the LCP candidate (e.g. the hero image). */
  priority?: boolean;
};

/**
 * Thin wrapper around <img> that bakes in the free browser-native
 * optimizations: explicit width/height (no layout shift while it loads),
 * lazy loading + async decoding off the critical path, and a fetchPriority
 * hint for whichever image actually is the LCP element.
 */
export function LazyImage({ src, alt, width, height, className, priority = false }: LazyImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}
