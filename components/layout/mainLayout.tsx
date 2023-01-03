import { Box, Container } from '@chakra-ui/react'
import React from 'react'
import MainHeader from './mainHeader'

type MainLayoutProps = {
  children: React.ReactNode
}
const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <MainHeader />
      <main>
        <Container maxW="max" centerContent>
          <Box>{children}</Box>
        </Container>
      </main>
    </>
  )
}

export default MainLayout
