import {
  Box,
  Card,
  CardBody,
  Divider,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import AsideInfo from 'components/common/asideInfo'
import WapInfo from 'components/common/wapInfo'
import TechnologiesList from 'components/techs/technologiesList'
import { Markets } from 'consts/markets'
import jpFeaturedTechs from 'data/jp/techs/featuredTechs.json'
import usFeaturedTechs from 'data/us/techs/featuredTechs.json'
import { getCompanies } from 'features/company/file/getCompanies'
import { getCategory } from 'features/tech/getCategory'
import { getTechsAndUsingCompanies } from 'features/tech/getTechs'
import { Category } from 'features/tech/Techs'
import { InferGetStaticPropsType, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import NextLink, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Techs: NextPage<Props> = (props) => {
  const { t } = useTranslation('techs')
  const router = useRouter()

  const toCategoryHref = {
    pathname: router.pathname + '/categories',
    query: {
      locale: router.query.locale,
      market: router.query.market,
    },
  }

  return (
    <VStack spacing="8" padding={4} align={'stretch'}>
      <Box borderBottomColor={'black'} borderBottom="1px">
        <Heading as="h1" size={'md'}>
          {router.query.market === Markets.US
            ? t('techsHeadingOfUs')
            : t('techsHeadingOfJp')}
        </Heading>
      </Box>
      <Card>
        <CardBody>
          <UnorderedList>
            <ListItem>
              <Text>{t('featuredTechnologiesAside')}</Text>
            </ListItem>
            <ListItem>
              <Trans
                ns="techs"
                i18nKey="techsToCategoriesLink"
                components={{
                  l: <LinkForTrans href={toCategoryHref} />,
                }}
              />
            </ListItem>
          </UnorderedList>
        </CardBody>
      </Card>
      <TechnologiesList
        categories={props.categories}
        allCompanies={props.companies}
      />
      <Divider />
      <AsideInfo />
      <WapInfo />
    </VStack>
  )
}

export const LinkForTrans = ({
  href,
  children,
}: React.PropsWithChildren<LinkProps>) => {
  // https://github.com/i18next/react-i18next/issues/1090#issuecomment-1215615932
  return (
    <NextLink href={href} legacyBehavior passHref>
      <Link textDecoration={'underline'}>{children}</Link>
    </NextLink>
  )
}
export default Techs

export const getStaticPaths = () => ({
  fallback: false,
  paths: i18nextConfig.i18n.locales
    .map((lng) =>
      Object.values(Markets).map((market) => ({
        params: {
          locale: lng,
          market: market,
        },
      }))
    )
    .flat(),
})

export const getStaticProps = async (context: any) => {
  //TODO: check slug can be null
  const allCompanies = getCompanies(context.params.market)
  const allTechs = getTechsAndUsingCompanies(allCompanies).map((it) => it.tech)

  const featuredTechsFromJson = (
    context.params.market === Markets.US ? usFeaturedTechs : jpFeaturedTechs
  ).featuredTechs.map((featuredTech) => {
    const featuredTechFromJson = allTechs.find(
      (tech) => tech.name === featuredTech
    )

    if (featuredTechFromJson === undefined) {
      throw Error(
        `No company uses ${featuredTech} listed in the featured json file`
      )
    }

    return featuredTechFromJson
  })

  // get categories by techs
  const categories = featuredTechsFromJson.flatMap((tech) =>
    getCategory(tech).flatMap((category) => {
      // push only one tech in the category (category had all techs belongs to it)
      category.technologies = [tech]
      return category
    })
  )

  // merge technologies in categories
  const mergedCategories = categories.reduce((acc, category) => {
    const foundCategory = acc.find((it) => it.id === category.id)
    if (foundCategory === undefined) {
      acc.push(category)
    } else {
      // merge technologies in foundCategory and tecnologies in category and delete duplicated
      foundCategory.technologies = Array.from(
        new Set(foundCategory.technologies.concat(category.technologies))
      )
    }
    return acc
  }, Array<Category>())

  return {
    props: {
      categories: mergedCategories,
      companies: allCompanies,
      ...(await serverSideTranslations(context.params.locale, [
        'top',
        'techs',
      ])),
    },
  }
}
