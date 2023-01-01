import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Link,
  List,
  ListItem,
  Stack,
  StackDivider,
  VStack,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

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

type Props = {
  categories: Category[]
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
          initial: technology.firstInitial,
        },
      }

      return (
        <ListItem key={technology.name}>
          <NextLink href={href} legacyBehavior passHref>
            <Link>{technology.name}</Link>
          </NextLink>
        </ListItem>
      )
    })

    return (
      <VStack key={category.id} align={'start'}>
        <Heading as="h3" size="xs" textTransform="uppercase">
          {category.name}
        </Heading>
        <List spacing={2}>{technologies}</List>
      </VStack>
    )
  })

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {t('technologiesHeading')}
        </Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {categories}
        </Stack>
      </CardBody>
    </Card>
  )
}

export default TechnologiesList
