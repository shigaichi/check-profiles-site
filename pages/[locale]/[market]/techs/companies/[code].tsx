import { Box, Divider, Heading, VStack } from '@chakra-ui/react'
import AsideInfo from 'components/common/asideInfo'
import WapInfo from 'components/common/wapInfo'
import CompanyInfo from 'components/techs/company/companyInfo'
import TechnologiesList from 'components/techs/company/technologiesList'
import { parseISO } from 'date-fns'
import { Company } from 'features/company/Company'
import { assertIsDefined } from 'lib/assert'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

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

type Params = {
  locale: string
  market: string
  code: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params as Params
  const url = process.env.API_BASE_URL
  assertIsDefined(url)

  const res = await fetch(
    `${url}/${params.market}/techs/companies/${params.code}.json`
  )

  if (res.status == 404) {
    console.error(`Not found. url: ${url}`)
    context.res.statusCode = 404
    return {
      notFound: true,
    }
  } else if (!res.ok) {
    console.error(`Failed to fetch. status: ${res.status} url: ${url}`)
    context.res.statusCode = 500
    throw new Error(`Failed to fetch. status: ${res.status} url: ${url}`)
  }

  const company = (await res.json()) as Company

  // The order of keys in JSON is not guaranteed.
  // So, it must be aligned on the server side.
  // TODO: check json batch
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
