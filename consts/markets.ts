export const Markets = {
  US: 'us',
  JA: 'jp',
} as const

export type MarketsType = typeof Markets[keyof typeof Markets]
