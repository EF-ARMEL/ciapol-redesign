/* Corps de texte issu du contenu officiel (Markdown converti au build).
   Le HTML provient exclusivement de web/content (contenu de ciapol.ci). */
export default function Prose({ html, className = "" }: { html: string; className?: string }) {
  return <div className={`prose-ciapol ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
