export const Markets = {
  US: 'us',
  JA: 'jp',
} as const

export type MarketsType = typeof Markets[keyof typeof Markets]

export function toMarket(position: string): MarketsType {
  switch (position) {
    case 'us':
      return Markets.US
    case 'jp':
      return Markets.JA
    default:
      throw new Error('Invalid market')
  }
}
