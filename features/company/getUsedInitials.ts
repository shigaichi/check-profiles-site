import { ALPHABETS, NUMBERS } from "consts/initials";
import { Company } from "./Company";
import { Markets, MarketsType } from "consts/markets";
/**
 * Get used alphabets by companies
 * @param companies
 */
export const getUsedAlphabets = (companies: Company[]): string[] => {
  return ALPHABETS.filter((initial) =>
    companies.some((company) => {
      if (initial !== ALPHABETS[0]) {
        return company.nameEn && company.nameEn.toLowerCase().startsWith(initial);
      } else {
        return company.nameEn && !/^[A-Za-z]+/.test(company.nameEn);
      }
    })
  );
};

/**
 * Get used numbers by companies
 * @param companies
 */
export const getUsedNumbers = (companies: Company[]): string[] => {
  return NUMBERS.filter((initial) =>
    companies.some((company) => {
      return company.code.startsWith(initial);
    })
  );
};

export const getUsedInitials = (companies: Company[], market: MarketsType): string[] => {
  // if market is us then return alphabets else return numbers
  return market === Markets.US ? getUsedAlphabets(companies) : getUsedNumbers(companies);
};
