import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { UrlObject } from 'url'

type Props = {
  heading: string
  text: string
  href: UrlObject
}

const TopLinkCard = (props: Props) => {
  const { t } = useTranslation('top')
  return (
    <Card maxW="sm">
      <CardHeader>
        <Heading size="md">{props.heading}</Heading>
      </CardHeader>
      <CardBody>
        <Text>{props.text}</Text>
      </CardBody>
      <CardFooter>
        <Button as={NextLink} cursor={'pointer'} href={props.href}>
          <Text>{t('viewHere')}</Text>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TopLinkCard
