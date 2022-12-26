import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'

import i18nextConfig from '../../next-i18next.config'

const TopPage = () => {
  return (
    <>
      <main>
        <SimpleGrid>
          <Card>
            <CardHeader>
              <Heading size="md"> Customer dashboard</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Customer dashboard</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
        </SimpleGrid>
      </main>
    </>
  )
}

export default TopPage

export const getStaticPaths = () => ({
  fallback: false,
  paths: i18nextConfig.i18n.locales.map((lng) => ({
    params: {
      locale: lng,
    },
  })),
})

export const getStaticProps = () => ({ props: {} })
