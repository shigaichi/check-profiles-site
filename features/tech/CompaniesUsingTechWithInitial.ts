export type CompaniesUsingTechWithInitial ={
  techName: string
  totalCompaniesNumber: number
  usingCompaniesNumber: number
  usingCompanies: UsingCompany[]
  otherInitials: string[]
}

export type UsingCompany ={
  code: string
  nameJa?: string
  nameEn?: string
}
