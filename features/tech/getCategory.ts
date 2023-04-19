import { Category, Technology } from "./Techs";
import { getCompanies } from "features/company/file/getCompanies";
import { Markets, MarketsType } from "consts/markets";

/**
 * Get category of a technology from all categories
 * @param targetTech
 */
export const getCategory = (targetTech: Technology): Category[] => {
  const companies = getCompanies(Markets.US).concat(getCompanies(Markets.JA));
  return companies.flatMap((company) => company.categories).filter((it) => it.technologies.find((tech) => tech.name === targetTech.name));
};

export const getAllCategories = (market: MarketsType): Category[] => {
  const companies = getCompanies(market);
  const categories = companies.flatMap((company) => company.categories);
  const categoryIds = Array.from(new Set(categories.map((category) => category.id))).sort((a, b) => a - b);
  return categoryIds.map((id) => categories.find((category) => category.id === id)!!);
};
