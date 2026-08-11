/* Mirrors the img() helper in tools/build-assets.py: a webp srcset with a jpg
   fallback, both pre-generated. No next/image — the derivatives already exist at
   four widths and export mode has no optimizer to run. */

type Props = {
  stem: string;
  widths: number[];
  fallback: string;
  width: number;
  height: number;
  alt: string;
  sizes?: string;
  priority?: boolean;
};

export function Picture({
  stem,
  widths,
  fallback,
  width,
  height,
  alt,
  sizes = "(max-width: 900px) 100vw, 52vw",
  priority = false,
}: Props) {
  const srcSet = widths.map((w) => `/media/${stem}-${w}.webp ${w}w`).join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={srcSet} sizes={sizes} />
      <img
        src={`/media/${fallback}`}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        alt={alt}
      />
    </picture>
  );
}
