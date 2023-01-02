import { Flex } from '@chakra-ui/react'

import TopLinkCard from 'components/top/topLinkCard'
import { Markets } from 'consts/markets'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import i18nextConfig from '../../next-i18next.config'

const TopPage = () => {
  const { t } = useTranslation('top')
  const router = useRouter()

  return (
    <main>
      <Flex flexWrap={'wrap'} gap={8} padding={4}>
        <TopLinkCard
          heading={t('usTechListHeading')}
          text={t('usTechListText')}
          href={{
            pathname: `${router.pathname}/[market]/techs`,
            query: {
              locale: router.query.locale,
              market: Markets.US,
            },
          }}
        />
        <TopLinkCard
          heading={t('jpxTechListHeading')}
          text={t('jpxTechListText')}
          href={{
            pathname: `${router.pathname}/[market]/techs`,
            query: {
              locale: router.query.locale,
              market: Markets.JA,
            },
          }}
        />
      </Flex>
    </main>
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

export const getStaticProps = async (context: any) => ({
  props: {
    ...(await serverSideTranslations(context.params.locale, ['top'])),
  },
})
