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
import { ALPHABETS, NUMBERS } from 'consts/initials'
import { Markets } from 'consts/markets'
import jpTechs from 'data/jp/techs/techs.json'
import usTechs from 'data/us/techs/techs.json'
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Technology: NextPage<Props> = (props) => {
  const { t } = useTranslation(['techs'])

  //TODO: version
  return (
    <VStack align={'stretch'} spacing={8} padding={4}>
      <Box borderBottomColor={'black'} borderBottom="1px">
        <Heading as="h1" size="md">
          {t('technologyUsingCompany', { val: props.technologyName })}
        </Heading>
      </Box>
      <Card>
        <CardBody>
          <UnorderedList>
            <ListItem>
              {t('companyNumber', {
                usingCompanyNumber: props.usingCompanyNumber,
                totalNumber: props.totalNumber,
                technologyName: props.technologyName,
              })}
            </ListItem>
          </UnorderedList>
        </CardBody>
      </Card>

      <AllCompaniesList
        filteredInitials={props.filteredInitials}
        companies={props.companies.map((it) => ({
          ticker: it.ticker,
          name: it.name,
          path: it.path,
        }))}
      />

      <Divider />

      <AsideInfo />
      <WapInfo />
    </VStack>
  )
}

export default Technology

export const getStaticPaths: GetStaticPaths = () => {
  const paths = i18nextConfig.i18n.locales
    .map((lng) =>
      Object.values(Markets).map((market) =>
        (market === Markets.US ? usTechs : jpTechs).techs.map((tech) => {
          const initials = market === Markets.US ? ALPHABETS : NUMBERS
          const filteredInitials = initials.filter((initial) =>
            tech.companies.some((company) => {
              if (market === Markets.US) {
                if (initial !== ALPHABETS[0]) {
                  return company.nameEn.toLowerCase().startsWith(initial)
                } else {
                  return !/^[A-Za-z]+/.test(company.nameEn)
                }
              } else {
                return company.ticker.startsWith(initial)
              }
            })
          )

          return filteredInitials.map((initial) => ({
            params: {
              locale: lng,
              technology: tech.slug,
              market: market,
              initial: initial,
            },
          }))
        })
      )
    )
    .flat()
    .flat()
    .flat()

  return {
    fallback: false,
    paths: paths,
  }
}
export const getStaticProps = async (context: any) => {
  const techs = context.params.market === Markets.US ? usTechs : jpTechs

  const technologyInfoList = techs.techs.filter(
    (it) => it.slug === context.params.technology
  )

  if (technologyInfoList.length !== 1) {
    // Basically not happen
    throw new Error(
      `${technologyInfoList.length} ${context.params.technology} was found in techs.json`
    )
  }

  const technologyInfo = technologyInfoList[0]

  // extract companies start with the params.initial and using the params.technology
  const filteredCompanies = technologyInfo.companies.flatMap((company) => {
    if (context.params.market === Markets.US) {
      if (context.params.initial === '0') {
        if (/^[A-Za-z]+/.test(company.nameEn)) {
          return []
        } else {
          return company
        }
      }

      if (company.nameEn.toLowerCase().startsWith(context.params.initial)) {
        return company
      } else {
        return []
      }
    } else {
      return company.ticker.startsWith(context.params.initial) ? company : []
    }
  })

  // extract initials where a company exists starting with that
  const initials = context.params.market === Markets.US ? ALPHABETS : NUMBERS
  const filteredInitials = initials.filter((initial) => {
    return technologyInfo.companies.some((company) => {
      {
        if (context.params.market === Markets.US) {
          if (initial !== ALPHABETS[0]) {
            return company.nameEn.toLowerCase().startsWith(initial)
          } else {
            return !/^[A-Za-z]+/.test(company.nameEn)
          }
        } else {
          return company.ticker.startsWith(initial)
        }
      }
    })
  })

  return {
    props: {
      technologyName: technologyInfo.name,
      market: context.params.market as string,
      totalNumber: techs.totalCompanyNumber,
      usingCompanyNumber: technologyInfo.companies.length,
      companies: filteredCompanies.map((it) => ({
        ticker: it.ticker,
        name: context.params.locale === 'en' ? it.nameEn : it.nameJa,
        path: `/${context.params.locale}/${
          context.params.market
        }/techs/companies/${it.ticker.toLowerCase()}`,
      })),
      filteredInitials: filteredInitials,
      ...(await serverSideTranslations(context.params.locale, [
        'top',
        'techs',
      ])),
    },
  }
}
