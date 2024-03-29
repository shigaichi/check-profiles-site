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
import { getAllCategories } from 'features/tech/getCategory'
import { InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Categories: NextPage<Props> = (props) => {
  const { t } = useTranslation('techs')
  const router = useRouter()

  const technologies = props.categories.map((category) => {
    const href = {
      pathname: `${router.pathname}/[category]`,
      query: {
        locale: router.query.locale,
        market: router.query.market,
        category: category.slug,
      },
    }

    return (
      <ListItem key={category.name}>
        <NextLink href={href} legacyBehavior passHref>
          <Link textDecoration={'underline'}>{category.name}</Link>
        </NextLink>
      </ListItem>
    )
  })

  return (
    <>
      <Head>
        <title>{t('categoriesPageTitle')}</title>
      </Head>
      <VStack spacing="8" padding={4} align={'stretch'}>
        <Box borderBottomColor={'black'} borderBottom="1px">
          <Heading as="h1" size={'md'}>
            {t('categoriesHeading')}
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
            <UnorderedList spacing={2}>{technologies}</UnorderedList>
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
        Object.values(Markets).map((market) => ({
          params: {
            locale: lng,
            market: market,
          },
        }))
      )
      .flat(),
  }
}

export const getStaticProps = async (context: any) => {
  const categories = getAllCategories(context.params.market)
    .map((category) => {
      return {
        name: category.name,
        slug: category.slug,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return {
    props: {
      categories: categories,
      ...(await serverSideTranslations(context.params.locale, [
        'top',
        'techs',
      ])),
    },
  }
}

export default Categories
