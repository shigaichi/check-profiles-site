import { Category } from "../tech/Techs";

export type Company = {
  code: string
  nameJa: string
  nameEn: string
  marketJa: string[]
  marketEn: string[]
  lastCheckedAt: string
  urls: Url[]
  categories: Category[]
}

export type Url = {
  url: string
  status: number
}

// export type Status = {
//   status: number
// }

// export type Category = {
//   id: number
//   name: string
//   slug: string
//   technologies: Technology[]
// }

// export type Technology = {
//   cpe?: string
//   icon: string
//   name: string
//   slug: string
//   version?: string
//   website: string
//   confidence: number
//   description: string
//   rootPath?: boolean
// }


