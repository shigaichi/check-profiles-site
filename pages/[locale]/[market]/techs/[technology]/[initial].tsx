import {
  Box,
  Card,
  CardBody,
  Divider,
  Heading,
  ListItem,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import AsideInfo from 'components/common/asideInfo'
import WapInfo from 'components/common/wapInfo'
import AllCompaniesList from 'components/techs/technologies/allCompaniesList'
import { Markets } from 'consts/markets'
import { getUsedInitials } from 'features/company/getUsedInitials'
import {
  CompaniesUsingTechWithInitial,
  UsingCompany,
} from 'features/tech/CompaniesUsingTechWithInitial'
import { getAllCategories } from 'features/tech/getCategory'
import fs from 'fs'
import {
  GetStaticPaths,
  GetStaticPathsResult,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import path from 'path'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Technology: NextPage<Props> = (props) => {
  const { t } = useTranslation(['techs'])
  const router = useRouter()

  const companies = props.companies as CompaniesUsingTechWithInitial

  //TODO: version
  return (
    <>
      <Head>
        <title>
          {t('technologyUsingCompanyPageTitle', { val: companies.techName })}
        </title>
      </Head>
      <VStack align={'stretch'} spacing={8} padding={4}>
        <Box borderBottomColor={'black'} borderBottom="1px">
          <Heading as="h1" size="md">
            {t('technologyUsingCompany', { val: companies.techName })}
          </Heading>
        </Box>
        <Card>
          <CardBody>
            <UnorderedList>
              <ListItem>
                {t('companyNumber', {
                  usingCompanyNumber: companies.usingCompaniesNumber,
                  totalNumber: companies.totalCompaniesNumber,
                  technologyName: companies.techName,
                })}
              </ListItem>
            </UnorderedList>
          </CardBody>
        </Card>

        <AllCompaniesList
          filteredInitials={companies.otherInitials}
          companies={companies.usingCompanies.map((company) => ({
            name: displayName(company, router.query.locale as string),
            ticker: company.code,
            path: `/${router.query.locale}/${
              router.query.market
            }/techs/companies/${
              router.query.market === Markets.US
                ? company.code.toLowerCase()
                : company.code
            }`,
          }))}
        />

        <Divider />

        <AsideInfo />
        <WapInfo />
      </VStack>
    </>
  )
}

export default Technology

export const getStaticPaths: GetStaticPaths = async () => {
  const markets = Object.values(Markets)
  const locales = i18nextConfig.i18n.locales

  const paths: GetStaticPathsResult['paths'] = []

  for (const locale of locales) {
    for (const market of markets) {
      const categories = getAllCategories(market)
      const technologies = Array.from(
        new Set(
          categories.flatMap((it) => it.technologies.map((tech) => tech.slug))
        )
      )

      for (const tech of technologies) {
        const initials = getUsedInitials(tech, market)

        for (const initial of initials) {
          paths.push({
            params: {
              locale,
              market,
              technology: tech,
              initial,
            },
          })
        }
      }
    }
  }

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params as {
    locale: string
    market: string
    technology: string
    initial: string
  }

  const filePath = path.join(
    process.cwd(),
    'data',
    params.market,
    'techs',
    'techs',
    params.technology,
    `${params.initial}.json`
  )

  let fileContent: string
  try {
    fileContent = fs.readFileSync(filePath, 'utf-8')
  } catch (err: any) {
    throw new Error(`❌ JSON Not Found: ${filePath}`)
  }

  const companies = JSON.parse(fileContent) as CompaniesUsingTechWithInitial

  return {
    props: {
      companies,
      ...(await serverSideTranslations(params.locale, ['top', 'techs'])),
    },
  }
}

const displayName = (company: UsingCompany, locale: string): string => {
  if (locale === 'ja') {
    return company.nameJa ?? company.nameEn!!
  } else {
    return company.nameEn ?? company.nameJa!!
  }
}
