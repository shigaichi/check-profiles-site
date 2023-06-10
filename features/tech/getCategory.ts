import { Category, Technology } from "./Techs";
import { getCompanies } from "features/company/file/getCompanies";
import { Markets, MarketsType } from "consts/markets";


const CATEGORY_CACHE:any={};
const ALL_CATEGORY_CACHE:any={};

/**
 * Get category of a technology from all categories
 * In json file, each category has technologies array. So get all categories and filter by target technology
 * @param targetTech
 */
export const getCategory = (targetTech: Technology): Category[] => {
  if (CATEGORY_CACHE[targetTech.name]) {
    return CATEGORY_CACHE[targetTech.name];
  }

  console.debug(`get category of ${targetTech.name} from all categories without cache`);

  const companies = getCompanies(Markets.US).concat(getCompanies(Markets.JA));
  const categories =  companies.flatMap((company) => company.categories).filter((it) => it.technologies.find((tech) => tech.name === targetTech.name));
  CATEGORY_CACHE[targetTech.name] = categories;
  return categories;
};

export const getAllCategories = (market: MarketsType): Category[] => {
  if (ALL_CATEGORY_CACHE[market]) {
    return ALL_CATEGORY_CACHE[market];
  }

  console.debug(`get all categories of ${market} without cache`)

  const companies = getCompanies(market);
  const categories = companies.flatMap((company) => company.categories);
  const categoryIds = Array.from(new Set(categories.map((category) => category.id)));

  const result = categoryIds.map((id) => categories.find((category) => category.id === id)!!)
    .map((category) => {
      const techs = new Set<string>
      // get all techs of the category and distinct by add set
      categories.filter((it) => it.id === category.id).map((it)=>{
        it.technologies.map((tech)=>techs.add(tech.name))
      })
      // replace techs array with distinct techs which is found at the first time in scanning. So values other than name in techs array can not be used.
      category.technologies = Array.from(techs).map((techName)=> categories.flatMap(it=>it.technologies).find((it)=>it.name===techName )!!)
      return category
    });

  ALL_CATEGORY_CACHE[market] = result;

  return result;
};
