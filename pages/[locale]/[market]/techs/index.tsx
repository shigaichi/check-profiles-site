import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'
import AsideInfo from 'components/common/asideInfo'
import TechnologiesList from 'components/techs/technologiesList'
import { ALPHABETS, NUMBERS } from 'consts/initials'
import { Markets } from 'consts/markets'
import jpFeaturedTechs from 'data/jp/techs/featuredTechs.json'
import jpTechs from 'data/jp/techs/techs.json'
import usFeaturedTechs from 'data/us/techs/featuredTechs.json'
import usTechs from 'data/us/techs/techs.json'
import { InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Techs: NextPage<Props> = (props) => {
  const { t } = useTranslation('techs')

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {t('techsHeading')}
        </Heading>
      </CardHeader>

      <CardBody>
        <TechnologiesList categories={props.categories} />
      </CardBody>

      <CardBody>
        <AsideInfo />
      </CardBody>
    </Card>
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

type Category = {
  id: number
  name: string
  technologies: Technology[]
}

type Technology = {
  name: string
  slug: string
  firstInitial: string
}

export const getStaticProps = async (context: any) => {
  //TODO: check slug can be null
  const techs = (context.params.market === Markets.US ? usTechs : jpTechs).techs
  const initials = context.params.market === Markets.US ? ALPHABETS : NUMBERS

  const featuredTechsFromJson = (
    context.params.market === Markets.US ? usFeaturedTechs : jpFeaturedTechs
  ).featuredTechs.map((featuredTech) => {
    const featuredTechFromJson = techs.find(
      (tech) => tech.name === featuredTech
    )

    if (featuredTechFromJson === undefined) {
      throw Error(
        `No company uses ${featuredTech} listed in the featured json file`
      )
    }

    return {
      name: featuredTech,
      slug: featuredTechFromJson.slug,
      category: featuredTechFromJson.categories[0],
    }
  })

  const categoryNames = Array.from(
    new Map(
      featuredTechsFromJson
        .map((tech) => tech.category)
        .map((category) => [category.id, category])
    ).values()
  )

  const categories: Category[] = categoryNames.map((category) => ({
    id: category.id,
    name: category.name,
    technologies: featuredTechsFromJson
      // Find the initial to be linked from featuredTech
      .filter((tech) => tech?.category.name === category.name)
      .map((featuredTech) => {
        const firstInitial = initials.find((letter) =>
          techs
            .filter((tech) => tech.name === featuredTech.name)
            // List companies using featuredTech
            .map((tech) => tech.companies)
            .flat()
            .some((company) => {
              if (context.params.market === Markets.US) {
                if (letter !== ALPHABETS[0]) {
                  return company.nameEn.toLowerCase().startsWith(letter)
                } else {
                  return !/^[A-Za-z]+/.test(company.nameEn)
                }
              } else {
                return company.ticker.startsWith(letter)
              }
            })
        )

        if (firstInitial === undefined) {
          // Basically does not occur
          throw new Error(`can not find companies using ${featuredTech.name}`)
        }

        return {
          name: featuredTech.name,
          slug: featuredTech.slug,
          firstInitial: firstInitial,
        }
      }),
  }))

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
