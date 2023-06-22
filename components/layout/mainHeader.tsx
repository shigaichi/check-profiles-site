import { Flex, HStack, Icon, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

const MainHeader = () => {
  const router = useRouter()
  const locale = router.query.locale

  return (
    <Flex as={'header'} py="4" mb="8" bg={'gray.100'} justifyContent="center">
      <NextLink href={'/' + locale} legacyBehavior passHref>
        <Link style={{ textDecoration: 'none' }}>
          <HStack>
            <Icon boxSize={5}>
              <path
                fill="#e83748"
                d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3l7 3V5c0-1.1-.9-2-2-2z"
              />
            </Icon>
            <Text fontSize="2xl">Kyokko Library</Text>
          </HStack>
        </Link>
      </NextLink>
    </Flex>
  )
}

export default MainHeader
