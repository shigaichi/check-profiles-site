import { MarketsType } from "consts/markets";
import fs from "fs";
import path from "path";
import { Company } from "features/company/Company";

export const getCompanies = (market: MarketsType): Company[] => {
  return fs
    .readdirSync(`data/${market}/techs/companies/`)
    .map((fileName) =>
      path.join(`data/${market}/techs/companies/`, fileName)
    )
    .map(
      (filePath) =>
        JSON.parse(fs.readFileSync(filePath, "utf-8")) as Company
    );
};
