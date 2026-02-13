/**
 * Extracts a plain-text excerpt from raw markdown content.
 * Finds the first paragraph of body after the first heading
 * and returns it truncated to the specified length.
 */
export function getExcerpt(body: string, length = 45): string {
  const lines = body.split('\n')

  let pastFirstHeading = false

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

      if (cleanedStr.length > length) {
        return cleanedStr.slice(0, 45) + '…'
      } else {
        return cleanedStr
      }
    }
  }
  return ''
}
