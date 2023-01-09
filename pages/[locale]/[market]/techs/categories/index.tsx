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
import jpTechs from 'data/jp/techs/techs.json'
import usTechs from 'data/us/techs/techs.json'
import { InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
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
  const techs =
    context.params.market === Markets.US ? usTechs.techs : jpTechs.techs

  const categories = Array.from(
    new Map(
      techs
        .map((tech) => tech.categories[0])
        .map((category) => [category.id, category])
    ).values()
  ).sort((a, b) => a.id - b.id)

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
