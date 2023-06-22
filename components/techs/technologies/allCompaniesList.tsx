import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Heading,
  HStack,
  Link,
  ListItem,
  Stack,
  StackDivider,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

type CompanyInfo = {
  ticker: string
  name: string
  path: string
}

type Props = {
  filteredInitials: string[]
  companies: CompanyInfo[]
}

const AllCompaniesList = (props: Props) => {
  const { t } = useTranslation(['techs'])
  const router = useRouter()
  const selectedPage = router.query.initial as string

  const initialIndex = props.filteredInitials.indexOf(selectedPage)

  const prevHref = {
    pathname: '/[locale]/[market]/techs/[technology]/[initial]',
    query: {
      locale: router.query.locale,
      market: router.query.market,
      technology: router.query.technology,
      initial: props.filteredInitials[initialIndex - 1],
    },
  }

  const nextHref = {
    pathname: '/[locale]/[market]/techs/[technology]/[initial]',
    query: {
      locale: router.query.locale,
      market: router.query.market,
      technology: router.query.technology,
      initial: props.filteredInitials[initialIndex + 1],
    },
  }

  const companyList = props.companies.map((company) => {
    return (
      <ListItem key={company.ticker}>
        <Link textDecoration={'underline'} as={NextLink} href={company.path}>
          {`${company.name} (${company.ticker})`}
        </Link>
      </ListItem>
    )
  })

  return (
    <Card>
      <CardHeader>
        <Heading as="h2" size="md">
          {t('allCompaniesList')}
        </Heading>
      </CardHeader>

      <Divider />

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <UnorderedList spacing={2}>{companyList}</UnorderedList>
        </Stack>
      </CardBody>

      <Divider />

      {/* pagination parts */}
      <CardBody>
        <Center>
          <HStack>
            {initialIndex !== 0 && (
              <>
                <Button
                  as={NextLink}
                  cursor={'pointer'}
                  href={prevHref}
                  variant={'link'}
                >
                  &lt;&lt;
                  {' ' + t('prev')}
                </Button>
                <Button
                  as={NextLink}
                  cursor={'pointer'}
                  href={prevHref}
                  variant={'link'}
                >
                  <Text>
                    {props.filteredInitials[initialIndex - 1].toUpperCase()}
                  </Text>
                </Button>
              </>
            )}
            <Button
              as={NextLink}
              cursor={'pointer'}
              href={{
                pathname: '/[locale]/[market]/techs/[technology]/[initial]',
                query: {
                  locale: router.query.locale,
                  market: router.query.market,
                  technology: router.query.technology,
                  initial: selectedPage,
                },
              }}
            >
              <Text>{selectedPage.toUpperCase()}</Text>
            </Button>

            {initialIndex !== props.filteredInitials.length - 1 && (
              <>
                <Button
                  as={NextLink}
                  cursor={'pointer'}
                  href={nextHref}
                  variant={'link'}
                >
                  <Text>
                    {props.filteredInitials[initialIndex + 1].toUpperCase()}
                  </Text>
                </Button>
                <Button
                  as={NextLink}
                  cursor={'pointer'}
                  href={{
                    pathname: '/[locale]/[market]/techs/[technology]/[initial]',
                    query: {
                      locale: router.query.locale,
                      market: router.query.market,
                      technology: router.query.technology,
                      initial: props.filteredInitials[initialIndex + 1],
                    },
                  }}
                  variant={'link'}
                >
                  {t('next') + ' '}
                  &gt;&gt;
                </Button>
              </>
            )}
          </HStack>
        </Center>
      </CardBody>
    </Card>
  )
}

export default AllCompaniesList
