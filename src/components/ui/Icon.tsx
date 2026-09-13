interface IconProps {
  /**
   * Inline SVG markup from src/content. These strings are authored in this
   * repo and never come from user input or an external source, which is what
   * makes dangerouslySetInnerHTML safe here.
   */
  svg: string;
  className?: string;
}

/** Renders a static SVG string from the content layer. */
export function Icon({ svg, className }: IconProps) {
  // `icon-slot` is display:contents, so this wrapper adds no box of its own
  // and the ported CSS lays the SVG out exactly as it did before.
  return (
    <span
      className={className ? `icon-slot ${className}` : 'icon-slot'}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

interface RichTextProps {
  /** Heading markup such as `Construction <em>Excellence</em>`. */
  html: string;
  className?: string;
}

/** Renders a heading fragment that contains an <em> accent, from content. */
export function RichHeading({ html, className }: RichTextProps) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
