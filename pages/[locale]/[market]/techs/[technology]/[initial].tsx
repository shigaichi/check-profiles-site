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
import { CompaniesUsingTechWithInitial } from 'features/tech/CompaniesUsingTechWithInitial'
import { assertIsDefined } from 'lib/assert'
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const Technology: NextPage<Props> = (props) => {
  const { t } = useTranslation(['techs'])
  const router = useRouter()

  const companies = props.companies as CompaniesUsingTechWithInitial

  //TODO: version
  return (
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
          name:
            router.query.locale === 'ja'
              ? company.nameJa
              : company.nameEn ?? company.nameJa,
          ticker: company.code,
          path: `/${router.query.locale}/${
            router.query.market
          }/techs/companies/${company.code.toLowerCase()}`,
        }))}
      />

      <Divider />

      <AsideInfo />
      <WapInfo />
    </VStack>
  )
}

export default Technology

type Params = {
  locale: string
  market: string
  technology: string
  initial: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const params = context.params as Params
  const baseUrl = process.env.API_BASE_URL
  assertIsDefined(baseUrl)

  const url = `${baseUrl}/${params.market}/techs/techs/${params.technology}/${params.initial}.json`

  const res = await fetch(url)

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

  const companies = (await res.json()) as CompaniesUsingTechWithInitial

  return {
    props: {
      companies,
      ...(await serverSideTranslations(params.locale, ['top', 'techs'])),
    },
  }
}
