import { Box, Divider, Heading, VStack } from '@chakra-ui/react'
import AsideInfo from 'components/common/asideInfo'
import WapInfo from 'components/common/wapInfo'
import CompanyInfo from 'components/techs/company/companyInfo'
import TechnologiesList from 'components/techs/company/technologiesList'
import { Markets } from 'consts/markets'
import { parseISO } from 'date-fns'
import { Company } from 'features/company/Company'
import fs from 'fs'
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import path from 'path'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Code: NextPage<Props> = (props) => {
  const { t } = useTranslation('techs')

  const lastCheckedAt = parseISO(props.lastCheckedAt)

  return (
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
  )
}

export default Code

export const getStaticPaths: GetStaticPaths = () => {
  const paths = i18nextConfig.i18n.locales
    .map((lng) =>
      Object.values(Markets).map((market) =>
        fs
          .readdirSync(`data/${market}/techs/companies/`)
          .map((fileName) =>
            path.join(`data/${market}/techs/companies/`, fileName)
          )
          .map(
            (filePath) =>
              JSON.parse(fs.readFileSync(filePath, 'utf-8')).code as string
          )
          .map((code) => ({
            params: {
              locale: lng,
              code: code.toLowerCase(),
              market: market,
            },
          }))
      )
    )
    .flat()
    .flat()

  return {
    fallback: false,
    paths: paths,
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
  ) as Company

  // The order of keys in JSON is not guaranteed.
  // So, it must be aligned on the server side.
  // TODO: check json batch
  const lastUrl = json.urls[json.urls.length - 1].url

  // const lastCheckedAt = parseISO(json.lastCheckedAt)
  // const isInvalidDate = Number.isNaN(lastCheckedAt.getTime())
  // if (isInvalidDate) {
  //   throw new Error(
  //     `Invalid Date. code: ${json.code} lastCheckedAt: ${json.lastCheckedAt}`
  //   )
  // }

  return {
    props: {
      code: json.code,
      name: context.params.locale === 'en' ? json.nameEn : json.nameJa,
      market: context.params.locale === 'en' ? json.marketEn : json.marketJa,
      lastCheckedAt: json.lastCheckedAt,
      url: lastUrl,
      categories: json.categories,
      ...(await serverSideTranslations(context.params.locale, [
        'top',
        'techs',
      ])),
    },
  }
}
