/**
 * Rendu de données structurées JSON-LD (schema.org).
 * Composant serveur pur — aucune hydrotation : injecte un <script>
 * que les moteurs lisent directement. La protection < est échappée.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default JsonLd;
