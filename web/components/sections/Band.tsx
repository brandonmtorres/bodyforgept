import { Picture } from "@/components/Picture";

export function Band() {
  return (
    <aside className="band" aria-label="BodyForge tagline">
      <Picture
        stem="room"
        widths={[640, 1000, 1500, 2000]}
        fallback="room-2000.jpg"
        width={2000}
        height={1333}
        sizes="100vw"
        alt="The BodyForge treatment floor on West Flagler Street, a session under way beside the plinth."
      />
      <p className="band__t">
        <span className="ln">Build stronger.</span>
        <span className="ln">
          <em>Live better.</em>
        </span>
      </p>
    </aside>
  );
}
