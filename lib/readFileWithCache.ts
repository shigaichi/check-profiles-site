import { Company } from 'features/company/Company'
import fs from 'fs'

const FILE_CACHE: any = {}

/**
 * Read file with cache
 * If file is already read, return cached data
 * @param fileName
 */
export const readFileWithCache = (fileName: string): Company => {
  if (FILE_CACHE[fileName]) {
    return FILE_CACHE[fileName]
  }

  const jsonBlob = fs.readFileSync(fileName, 'utf8')
  const company = JSON.parse(jsonBlob) as Company

  FILE_CACHE[fileName] = company

  return company
}
