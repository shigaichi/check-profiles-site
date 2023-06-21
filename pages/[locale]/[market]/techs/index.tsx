import {
  Box,
  Card,
  CardBody,
  Divider,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import AsideInfo from 'components/common/asideInfo'
import WapInfo from 'components/common/wapInfo'
import TechnologiesList from 'components/techs/technologiesList'
import { Markets } from 'consts/markets'
import { getUsedInitials } from 'features/company/getUsedInitials'
import { getFocusedTechCategories } from 'features/tech/getFocusedTechCategories'
import { InferGetStaticPropsType, NextPage } from 'next'
import { Trans, useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import NextLink, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Techs: NextPage<Props> = (props) => {
  const { t } = useTranslation('techs')
  const router = useRouter()

  const toCategoryHref = {
    pathname: router.pathname + '/categories',
    query: {
      locale: router.query.locale,
      market: router.query.market,
    },
  }

  return (
    <>
      <Head>
        <title>{t('techsPageTitle')}</title>
      </Head>
      <VStack spacing="8" padding={4} align={'stretch'}>
        <Box borderBottomColor={'black'} borderBottom="1px">
          <Heading as="h1" size={'md'}>
            {router.query.market === Markets.US
              ? t('techsHeadingOfUs')
              : t('techsHeadingOfJp')}
          </Heading>
        </Box>
        <Card>
          <CardBody>
            <UnorderedList>
              <ListItem>
                <Text>{t('featuredTechnologiesAside')}</Text>
              </ListItem>
              <ListItem>
                <Trans
                  ns="techs"
                  i18nKey="techsToCategoriesLink"
                  components={{
                    l: <LinkForTrans href={toCategoryHref} />,
                  }}
                />
              </ListItem>
            </UnorderedList>
          </CardBody>
        </Card>
        <TechnologiesList categories={props.categories} />
        <Divider />
        <AsideInfo />
        <WapInfo />
      </VStack>
    </>
  )
}

export const LinkForTrans = ({
  href,
  children,
}: React.PropsWithChildren<LinkProps>) => {
  // https://github.com/i18next/react-i18next/issues/1090#issuecomment-1215615932
  return (
    <NextLink href={href} legacyBehavior passHref>
      <Link textDecoration={'underline'}>{children}</Link>
    </NextLink>
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

export const getStaticProps = async (context: any) => {
  const categories = getFocusedTechCategories(context.params.market).map(
    (category) => {
      return {
        id: category.id,
        name: category.name,
        technologies: category.technologies.map((tech) => {
          return {
            name: tech.name,
            slug: tech.slug,
            initial: getUsedInitials(tech.slug, context.params.market)[0],
          }
        }),
      }
    }
  )

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
