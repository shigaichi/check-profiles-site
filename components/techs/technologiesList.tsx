import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Link,
  List,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  categories: {
    id: number
    name: string
    technologies: { name: string; slug: string; initial: string }[]
  }[]
}

const TechnologiesList: NextPage<Props> = (props) => {
  const { t } = useTranslation('techs')
  const router = useRouter()

  const categories = props.categories.map((category) => {
    // TODO: use tech icons from wap
    const technologies = category.technologies.map((technology) => {
      const href = {
        pathname: `${router.pathname}/[technology]/[initial]`,
        query: {
          locale: router.query.locale,
          market: router.query.market,
          technology: technology.slug,
          initial: technology.initial,
        },
      }

      return (
        <ListItem key={technology.name}>
          <NextLink href={href} legacyBehavior passHref>
            <Link textDecoration={'underline'}>{technology.name}</Link>
          </NextLink>
        </ListItem>
      )
    })

    return (
      <ListItem key={category.id}>
        <Heading as="h3" size="xs" marginBottom={2}>
          {category.name}
        </Heading>
        <UnorderedList spacing={2}>{technologies}</UnorderedList>
      </ListItem>
    )
  })

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {t('technologiesHeading')}
        </Heading>
      </CardHeader>

      <Divider />

      <CardBody>
        <List spacing={4}>{categories}</List>
      </CardBody>
    </Card>
  )
}

export default TechnologiesList
