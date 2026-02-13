/**
 * Extracts a plain-text excerpt from raw markdown content.
 * Finds the first paragraph(s) of body after the first heading
 * and returns them up to the specified length, preserving sentence breaks.
 */
export function getExcerpt(body: string, length = 150): string {
  const lines = body.split('\n')
  let pastFirstHeading = false
  let collected = ''

  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('##')) {
      pastFirstHeading = true
      continue
    }

    if (pastFirstHeading) {
      const trimmed = line.trim()

      if (trimmed.length === 0 || trimmed.startsWith('#') || trimmed.startsWith('::')) {
        continue
      }

      const cleanedStr = trimmed
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/`(.*?)`/g, '$1')

      // Accumulate text across multiple lines
      collected += (collected ? ' ' : '') + cleanedStr

      // Stop when we have enough content
      if (collected.length >= length) {
        return collected.slice(0, length) + '…'
      }
    }
  }

  return collected || ''
}
