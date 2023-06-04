import { ExternalLinkIcon } from '@chakra-ui/icons'
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
  Tag,
  VStack,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import { useTranslation } from 'next-i18next'

type Category = {
  id: number
  name: string
  technologies: Technology[]
}

type Technology = {
  name: string
  version?: string
  website: string
}

type Props = {
  categories: Category[]
}

const TechnologiesList: NextPage<Props> = (props) => {
  const { t } = useTranslation('techs')

  const categories = props.categories.map((category, i) => {
    const technologies = category.technologies.map((technology, j) => {
      // TODO: use tech icons from wap
      return (
        <ListItem key={j}>
          <Link href={technology.website} isExternal={true}>
            {technology.name}
            {technology.version != null && technology.version.length > 0 && (
              <Tag size={'sm'} marginLeft={1} marginTop={1}>
                {technology.version}
              </Tag>
            )}
            <ExternalLinkIcon />
          </Link>
        </ListItem>
      )
    })

    return (
      <VStack key={i} align={'start'}>
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
          {t('technologiesListOfCompanyHeading')}
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
