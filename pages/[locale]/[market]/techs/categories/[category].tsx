import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Link,
  ListItem,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import AsideInfo from 'components/common/asideInfo'
import WapInfo from 'components/common/wapInfo'
import { Markets } from 'consts/markets'
import { getCompanies } from 'features/company/file/getCompanies'
import { getUsedInitials } from 'features/company/getUsedInitials'
import { getAllCategories } from 'features/tech/getCategory'
import { getTechsAndUsingCompanies } from 'features/tech/getTechs'
import { InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Category: NextPage<Props> = (props) => {
  const { t } = useTranslation('techs')
  const router = useRouter()

  const technologies = props.techs.map((tech) => {
    const href = {
      pathname: '/[locale]/[market]/techs/[technology]/[initial]',
      query: {
        locale: router.query.locale,
        market: router.query.market,
        technology: tech.slug,
        initial: tech.firstInitial,
      },
    }

    return (
      <ListItem key={tech.name}>
        <NextLink href={href} legacyBehavior passHref>
          <Link textDecoration={'underline'}>{tech.name}</Link>
        </NextLink>
      </ListItem>
    )
  })

  return (
    <>
      <Head>
        <title>{t('categoryPageTitle', { val: props.category.name })}</title>
      </Head>
      <VStack spacing="8" padding={4} align={'stretch'}>
        <Box borderBottomColor={'black'} borderBottom="1px">
          <Heading as="h1" size={'md'}>
            {t('categoryHeading', { val: props.category.name })}
          </Heading>
        </Box>

        <Card>
          <CardHeader>
            <Heading as="h2" size="md">
              {t('categoriesAside')}
            </Heading>
          </CardHeader>

          <Divider />

          <CardBody>
            <UnorderedList spacing={4}>{technologies}</UnorderedList>
          </CardBody>
        </Card>
        <Divider />
        <AsideInfo />
        <WapInfo />
      </VStack>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    fallback: false,
    paths: i18nextConfig.i18n.locales
      .map((lng) =>
        Object.values(Markets).map((market) => {
          return getAllCategories(market).map((category) => ({
            params: {
              locale: lng,
              market: market,
              category: category.slug,
            },
          }))
        })
      )
      .flat()
      .flat(),
  }
}

export const getStaticProps = async (context: any) => {
  const techsAndUsingCompanies = getTechsAndUsingCompanies(
    getCompanies(context.params.market)
  )

  // get category from all categories by slug
  const category = getAllCategories(context.params.market).find(
    (it) => it.slug === context.params.category
  )

  if (!category) {
    // Basically does not occur
    throw new Error(`${context.params.category} is not found`)
  }

  //TODO: check category slug is unique
  const techsOfCategory = category.technologies
    .map((tech) => {
      const allCompanyUsingTech = techsAndUsingCompanies.find(
        (it) => it.tech.name === tech.name
      )

      if (allCompanyUsingTech == null) {
        // Basically does not occur
        throw new Error(`${tech.name} is not used in all companies`)
      }

      const firstInitial = getUsedInitials(
        allCompanyUsingTech.companies,
        context.params.market
      )[0]
      return { name: tech.name, slug: tech.slug, firstInitial }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    props: {
      category: category,
      techs: techsOfCategory,
      ...(await serverSideTranslations(context.params.locale, [
        'top',
        'techs',
      ])),
    },
  }
}

export default Category
