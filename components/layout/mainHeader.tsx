import { Flex, Link, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

const MainHeader = () => {
  const { t } = useTranslation('top')
  const router = useRouter()
  const locale = router.query.locale

  return (
    <Flex as={'header'} py="4" mb="8" bg={'gray.100'} justifyContent="center">
      <NextLink href={'/' + locale} legacyBehavior passHref>
        <Link style={{ textDecoration: 'none' }}>
          <Text fontSize="1xl">Kyokko Library</Text>
        </Link>
      </NextLink>
    </Flex>
  )
}

export default MainHeader
