/* Structured data is emitted as a script tag rather than through the metadata API,
   because the graph uses @graph and cross-references between nodes that the metadata
   helpers do not model. */

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
