export const Markets = {
  US: 'us',
  JA: 'ja',
} as const

export type MarketsType = typeof Markets[keyof typeof Markets]
