import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Link,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
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
          <Link>{category.name}</Link>
        </NextLink>
      </ListItem>
    )
  })

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {t('categoriesHeading')}
        </Heading>
      </CardHeader>

      <CardBody>
        <Card>
          <CardHeader>
            <Heading as="h3" size="sm">
              {t('categoriesAside')}
            </Heading>
          </CardHeader>
          <CardBody>
            <UnorderedList>{technologies}</UnorderedList>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
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
      ...(await serverSideTranslations(context.params.locale, ['techs'])),
    },
  }
}

export default Categories
