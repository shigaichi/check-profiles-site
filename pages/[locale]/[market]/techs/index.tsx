import { Card, CardBody, CardHeader, Heading } from '@chakra-ui/react'
import { InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AsideInfo from '../../../../components/common/asideInfo'
import TechnologiesList from '../../../../components/techs/technologiesList'
import { ALPHABETS } from '../../../../consts/initials'
import { Markets } from '../../../../consts/markets'
import featuredTechs from '../../../../data/featuredTechs.json'
import techs from '../../../../data/us/techs/techs.json'
import i18nextConfig from '../../../../next-i18next.config'

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
  paths: i18nextConfig.i18n.locales.map((lng) => ({
    params: {
      locale: lng,
      market: Markets.US,
    },
  })),
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
  const featuredTechsFromJson = featuredTechs.featuredTechs.map(
    (featuredTech) => {
      const featuredTechFromJson = techs.techs.find(
        (tech) => tech.name === featuredTech
      )

      if (featuredTechFromJson === undefined) {
        throw Error('No company uses tech in the featured json file')
      }

      return {
        name: featuredTech,
        slug: featuredTechFromJson.slug,
        category: featuredTechFromJson.categories[0],
      }
    }
  )

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
      .filter((tech) => tech?.category.name === category.name)
      .map((tech) => {
        const firstInitial = ALPHABETS.find((letter) =>
          techs.techs
            .filter((tech) => tech.name === tech.name)
            .map((tech) => tech.companies)
            .flat()
            .some((company) => {
              if (letter !== ALPHABETS[0]) {
                return company.name.toLowerCase().startsWith(letter)
              } else {
                return !/^[A-Za-z]+/.test(company.name)
              }
            })
        )

        if (firstInitial === undefined) {
          // Basically does not occur
          throw new Error(`can not find companies using ${tech.name}`)
        }

        return { name: tech.name, slug: tech.slug, firstInitial: firstInitial }
      }),
  }))

  return {
    props: {
      categories: categories,
      ...(await serverSideTranslations(context.params.locale, ['techs'])),
    },
  }
}
