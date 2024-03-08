import { Heading, Link, Text, VStack } from '@chakra-ui/react'
import { InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import i18nextConfig from 'next-i18next.config'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Custom404: NextPage<Props> = () => {
  const { t, i18n } = useTranslation('top')

  const router = useRouter()

  useEffect(() => {
    if (typeof umami !== 'undefined') {
      umami.track('404_error', { path: router.asPath })
    }
  }, [router.asPath])

  useEffect(() => {
    const locale = navigator.language
    const detectedLng =
      locale.toLowerCase().includes('ja') || locale.toLowerCase().includes('jp')
        ? 'ja'
        : 'en'
    i18n.changeLanguage(detectedLng)
  }, [i18n])

  return (
    <>
      <Head>
        <title>Not Found</title>
      </Head>
      <VStack>
        <Heading as={'h1'}>{t('pageNotFound')}</Heading>
        <NextLink href={'/' + i18n.language ?? 'en'} legacyBehavior passHref>
          <Link style={{ textDecoration: 'none' }}>
            <Text textDecoration={'underline'}>{t('toTopPageFrom404')}</Text>
          </Link>
        </NextLink>
      </VStack>
    </>
  )
}

export default Custom404

export const getStaticProps = async () => {
  return {
    props: {
      ...(await serverSideTranslations(
        'en',
        ['top'],
        null,
        i18nextConfig.i18n.locales
      )),
    },
  }
}
