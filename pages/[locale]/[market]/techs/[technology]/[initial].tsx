import {
  Card,
  CardBody,
  Divider,
  Heading,
  ListItem,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import AsideInfo from '../../../../../components/common/asideInfo'
import AllCompaniesList from '../../../../../components/techs/technologies/allCompaniesList'
import { ALPHABETS } from '../../../../../consts/initials'
import { Markets } from '../../../../../consts/markets'
import usTechs from '../../../../../data/us/techs/techs.json'
import i18nextConfig from '../../../../../next-i18next.config'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Technology: NextPage<Props> = (props) => {
  const { t } = useTranslation(['techs'])
  const router = useRouter()

  //TODO: version
  return (
    <VStack align={'stretch'} spacing={8} padding={4}>
      <Heading as="h1" size="lg">
        {t('technologyUsingCompany', { val: props.technologyName })}
      </Heading>
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
          name: it.name,
          path: it.path,
        }))}
      />

      <Divider />

      <AsideInfo />
    </VStack>
  )
}

export default Technology

export const getStaticPaths: GetStaticPaths = () => {
  //TODO: add JPX
  const us = i18nextConfig.i18n.locales
    .map((lng) =>
      usTechs.techs.map((tech) => {
        const filteredAlphabet = ALPHABETS.filter((letter) =>
          tech.companies.some((company) => {
            if (letter !== ALPHABETS[0]) {
              return company.name.toLowerCase().startsWith(letter)
            } else {
              return !/^[A-Za-z]+/.test(company.name)
            }
          })
        )

        return filteredAlphabet.map((letter) => {
          return {
            params: {
              locale: lng,
              technology: tech.slug,
              market: Markets.US,
              initial: letter,
            },
          }
        })
      })
    )
    .flat()
    .flat()

  return {
    fallback: false,
    paths: us,
  }
}
export const getStaticProps = async (context: any) => {
  const technologyInfoList = usTechs.techs.filter(
    (it) => it.slug === context.params.technology
  )

  if (technologyInfoList.length !== 1) {
    throw new Error(
      'technologyInfoList.length: ' + technologyInfoList.length.toString()
    )
  }

  const technologyInfo = technologyInfoList[0]

  const filteredCompanies = technologyInfo.companies.flatMap((company) => {
    if (context.params.initial === '0') {
      if (/^[A-Za-z]+/.test(company.name)) {
        return []
      } else {
        return company
      }
    }

    if (company.name.toLowerCase().startsWith(context.params.initial)) {
      return company
    } else {
      return []
    }
  })

  const filteredAlphabet = ALPHABETS.filter((letter) => {
    return technologyInfo.companies.some((company) => {
      {
        if (letter !== ALPHABETS[0]) {
          return company.name.toLowerCase().startsWith(letter)
        } else {
          return !/^[A-Za-z]+/.test(company.name)
        }
      }
    })
  })

  return {
    props: {
      technologyName: technologyInfo.name,
      market: context.params.market as string,
      totalNumber: usTechs.totalCompanyNumber,
      usingCompanyNumber: technologyInfo.companies.length,
      companies: filteredCompanies.map((it) => ({
        name: it.name,
        path: `/${context.params.locale}/${
          context.params.market
        }/techs/companies/${it.ticker.toLowerCase()}`,
      })),
      filteredInitials: filteredAlphabet,
      ...(await serverSideTranslations(context?.params?.locale, [
        'techs',
        'common',
      ])),
    },
  }
}
