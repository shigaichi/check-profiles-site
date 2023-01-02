import { Divider, Heading, VStack } from '@chakra-ui/react'
import AsideInfo from 'components/common/asideInfo'
import CompanyInfo from 'components/techs/company/companyInfo'
import TechnologiesList from 'components/techs/company/technologiesList'
import { Markets } from 'consts/markets'
import jaCompanies from 'data/jp/techs/companies.json'
import usCompanies from 'data/us/techs/companies.json'
import { parse } from 'date-fns'
import fs from 'fs'
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from 'next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import path from 'path'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Code: NextPage<Props> = (props) => {
  const lastCheckedAt = parse(
    props.lastCheckedAt,
    'yyyy-MM-dd hh:mm:ss.SSSSSS',
    new Date()
  )

  return (
    <VStack align={'stretch'} spacing={8} padding={4}>
      <Heading as="h1" size="lg">
        {props.name}
      </Heading>
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
    </VStack>
  )
}

export default Code

export const getStaticPaths: GetStaticPaths = () => {
  const us = i18nextConfig.i18n.locales
    .map((lng) =>
      Object.values(Markets).map((market) =>
        (market === Markets.US
          ? usCompanies.companies
          : jaCompanies.companies
        ).map((company) => ({
          params: {
            locale: lng,
            code: company.toLowerCase(),
            market: market,
          },
        }))
      )
    )
    .flat()
    .flat()

  return {
    fallback: false,
    paths: us,
  }
}

export const getStaticProps = async (context: any) => {
  const json = JSON.parse(
    fs.readFileSync(
      path.resolve(
        process.cwd(),
        `data/${context.params.market}/techs/companies/${context.params.code}.json`
      ),
      'utf-8'
    )
  )

  // The order of keys in JSON is not guaranteed.
  // So, it must be aligned on the server side.
  const lastUrl = Object.keys(json.urls).pop()!!

  return {
    props: {
      code: json.code,
      name: context.params.locale === 'en' ? json.nameEn : json.nameJa,
      market: context.params.locale === 'en' ? json.marketEn : json.marketJa,
      lastCheckedAt: json.lastCheckedAt,
      url: lastUrl,
      categories: json.categories,
      ...(await serverSideTranslations(context.params.locale, ['techs'])),
    },
  }
}
