import { MarketsType } from 'consts/markets'
import fs from 'fs'

/**
 * return initials of companies using the tech
 * @param slug tech name (slug)
 * @param market US or JA
 */
export const getUsedInitials = (
  slug: string,
  market: MarketsType
): string[] => {
  const techDir = `data/${market}/techs/techs/${slug}`
  const files = fs.readdirSync(techDir)
  if (files.length < 1) {
    throw new Error(`No techs found: ${slug} (market: ${market})`)
  }
  const json = JSON.parse(fs.readFileSync(`${techDir}/${files[0]}`, 'utf8'))
  return json.otherInitials
}
