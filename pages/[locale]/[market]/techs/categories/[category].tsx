import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Link,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
import { ALPHABETS } from 'consts/initials'
import { Markets } from 'consts/markets'
import usTechs from 'data/us/techs/techs.json'
import { InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
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
          <Link>{tech.name}</Link>
        </NextLink>
      </ListItem>
    )
  })

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {t('categoryHeading', { val: props.category.name })}
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
        Object.values(Markets).map((market) => {
          const techs = market === Markets.US ? usTechs.techs : usTechs.techs

          const categories = Array.from(
            new Map(
              techs
                .map((tech) => tech.categories[0])
                .map((category) => [category.id, category])
            ).values()
          ).sort((a, b) => a.id - b.id)

          return categories.map((category) => ({
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
  const techs =
    context.params.market === Markets.US ? usTechs.techs : usTechs.techs

  const category = techs
    .map((tech) => tech.categories)
    .flat()
    .find((category) => category.slug === context.params.category)

  if (!category) {
    // Basically does not occur
    throw new Error(`${context.params.category} is not found in techs.json`)
  }

  //TODO: check category slug is unique
  const techsOfCategory = techs
    .filter((tech) => tech?.categories[0].id === category.id)
    .map((tech) => {
      const firstInitial = ALPHABETS.find((letter) =>
        techs
          .filter((tech) => tech.name === tech.name)
          .map((tech) => tech.companies)
          .flat()
          .some((company) => {
            if (letter !== ALPHABETS[0]) {
              return company.nameEn.toLowerCase().startsWith(letter)
            } else {
              return !/^[A-Za-z]+/.test(company.nameEn)
            }
          })
      )

      if (firstInitial === undefined) {
        // Basically does not occur
        throw new Error(`can not find companies using ${tech.name}`)
      }

      return { name: tech.name, slug: tech.slug, firstInitial: firstInitial }
    })

  return {
    props: {
      category: category,
      techs: techsOfCategory,
      ...(await serverSideTranslations(context.params.locale, ['techs'])),
    },
  }
}

export default Category
