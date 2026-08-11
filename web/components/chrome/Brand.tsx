import { BrandLink } from "./HashLink";

export function Brand({ size = 40 }: { size?: number }) {
  return (
    <BrandLink className="brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="brand__mark"
        src="/media/mark-light.png"
        alt=""
        width={size}
        height={size}
        loading={size > 40 ? "lazy" : undefined}
        decoding="async"
      />
      <span className="brand__type">
        <span className="brand__name">
          Body<em>Forge</em>
        </span>
        <span className="brand__sub">Physical Therapy</span>
      </span>
    </BrandLink>
  );
}
