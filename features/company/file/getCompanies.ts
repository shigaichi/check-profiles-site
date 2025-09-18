import { MarketsType } from 'consts/markets'
import { Company } from 'features/company/Company'
import fs from 'fs'
import { readFileWithCache } from 'lib/readFileWithCache'
import path from 'path'

const COMPANIES_CACHE: any = {}

export const getCompanies = (market: MarketsType): Company[] => {
  if (COMPANIES_CACHE[market]) {
    return COMPANIES_CACHE[market]
  }

  const result = fs
    .readdirSync(`data/${market}/techs/companies/`)
    .map((fileName) => path.join(`data/${market}/techs/companies/`, fileName))
    .map((filePath) => readFileWithCache(filePath))

  COMPANIES_CACHE[market] = result
  return result
}
