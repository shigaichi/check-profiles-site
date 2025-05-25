import { Box, Divider, Heading, VStack } from '@chakra-ui/react'
import AsideInfo from 'components/common/asideInfo'
import WapInfo from 'components/common/wapInfo'
import CompanyInfo from 'components/techs/company/companyInfo'
import TechnologiesList from 'components/techs/company/technologiesList'
import { parseISO } from 'date-fns'
import { Company } from 'features/company/Company'
import fs from 'fs'
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import path from 'path'
import { Markets } from '../../../../../consts/markets'
import { getCompanies } from '../../../../../features/company/file/getCompanies'
import i18nextConfig from '../../../../../next-i18next.config'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Code: NextPage<Props> = (props) => {
  const { t } = useTranslation('techs')

  const lastCheckedAt = parseISO(props.lastCheckedAt)

  return (
    <>
      <Head>
        <title>{t('companyPageTitle', { val: props.name })}</title>
      </Head>
      <VStack align={'stretch'} spacing={8} padding={4}>
        <Box borderBottomColor={'black'} borderBottom="1px">
          <Heading as="h1" size="md">
            {t('companyHeading', { val: props.name })}
          </Heading>
        </Box>
        <CompanyInfo
          companyCode={props.code}
          companyName={props.name}
          lastChecked={lastCheckedAt}
          link={props.url}
          market={props.market}
        />
        <TechnologiesList categories={props.categories} />
        <Divider />
        <AsideInfo />
        <WapInfo />
      </VStack>
    </>
  )
}

export default Code

export const getStaticPaths: GetStaticPaths = async () => {
  const markets = Object.values(Markets)
  const locales = i18nextConfig.i18n.locales

  const paths: { params: { locale: string; market: string; code: string } }[] =
    []

  for (const market of markets) {
    const companies = getCompanies(market)

    for (const locale of locales) {
      for (const company of companies) {
        const code =
          market === Markets.US ? company.code.toLowerCase() : company.code

        paths.push({
          params: {
            locale,
            market,
            code,
          },
        })
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
    code: string
  }

  const codeFileName =
    params.market === Markets.US ? params.code.toLowerCase() : params.code

  const filePath = path.join(
    process.cwd(),
    'data',
    params.market,
    'techs',
    'companies',
    `${codeFileName}.json`
  )

  let fileContent: string

  try {
    fileContent = fs.readFileSync(filePath, 'utf-8')
  } catch (err: any) {
    throw new Error(`❌ JSON Not Found: ${filePath}`)
  }

  const company = JSON.parse(fileContent) as Company
  const lastUrl = company.urls[company.urls.length - 1].url

  return {
    props: {
      code: company.code,
      name: displayName(params.locale, company.nameJa, company.nameEn),
      market: params.locale === 'en' ? company.marketEn : company.marketJa,
      lastCheckedAt: company.lastCheckedAt,
      url: lastUrl,
      categories: company.categories,
      ...(await serverSideTranslations(params.locale, ['top', 'techs'])),
    },
  }
}

const displayName = (
  locale: string,
  nameJa?: string,
  nameEn?: string
): string => {
  if (locale === 'ja') {
    return nameJa ?? nameEn!!
  } else {
    return nameEn ?? nameJa!!
  }
}
