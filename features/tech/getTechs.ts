import { Technology, TechsAndUsingCompanies } from "features/tech/Techs";
import { Company } from "features/company/Company";

/**
 * Get technologies and companies using them
 * @param companies
 */
export const getTechsAndUsingCompanies = (companies: Company[]): TechsAndUsingCompanies[] => {
  const totalCompanyNumber = companies.length;

  // extract technologies from companies and remove duplicates and concat to array
  const technologies = companies.reduce(
    (accumulator, currentValue) => {
      return accumulator.concat(
        currentValue.categories.flatMap((category) => category.technologies)
      );
    },
    new Array<Technology>
  );

  // remove duplicates
  const technologiesSet = Array.from(new Set(technologies.map((tech) => tech.name))).map((name) => technologies.find((tech) => tech.name === name)!!);

  return technologiesSet.map((tech) => {
    return { totalCompanyNumber: totalCompanyNumber, tech: tech, companies: getCompanyUsingTech(tech, companies) };
  });
};

/**
 * Get companies using a specific technology
 * @param targetTech
 * @param companies
 */
export const getCompanyUsingTech = (targetTech: Technology, companies: Company[]): Company[] => {
  return companies.filter((company) => company.categories.find((category) => category.technologies.find((tech) => targetTech.name === tech.name)));
};
