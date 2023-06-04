import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Link,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

type CompanyInfoProps = {
  companyCode: string
  companyName: string
  link: string
  // TODO: check how to display array of strings
  market: string[]
  lastChecked: Date
}

const CompanyInfo = (props: CompanyInfoProps) => {
  const { t } = useTranslation('techs')

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {t('infoHeading')}
        </Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading as="h3" size="xs" textTransform="uppercase">
              {t('market')}
            </Heading>
            <Text pt="2" fontSize="sm">
              {props.market}
            </Text>
          </Box>
          <Box>
            <Heading as="h3" size="xs" textTransform="uppercase">
              {t('companyCode')}
            </Heading>
            <Text pt="2" fontSize="sm">
              {props.companyCode}
            </Text>
          </Box>
          <Box>
            <Heading as="h3" size="xs" textTransform="uppercase">
              {t('lastCheckedAt')}
            </Heading>
            <Text pt="2" fontSize="sm">
              {t('intlDateTime', { val: props.lastChecked })}
            </Text>
          </Box>
          <Box>
            <Heading as="h3" size="xs" textTransform="uppercase">
              {t('link')}
            </Heading>
            <Link href={props.link} isExternal>
              {props.link} <ExternalLinkIcon mx="2px" />
            </Link>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default CompanyInfo
