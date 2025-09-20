export type Category = {
  id: number
  name: string
  slug: string
  technologies: Technology[]
}

export type Technology = {
  cpe?: string | null
  icon: string
  name: string
  slug: string
  version?: string
  website: string
  confidence: number
  rootPath?: boolean
  description: string
}
