import { Container } from '@chakra-ui/react'
import React from 'react'
import MainHeader from './mainHeader'

type MainLayoutProps = {
  children: React.ReactNode
}
const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <MainHeader />
      <Container as={'main'} minW={{ lg: '1024px' }}>
        {children}
      </Container>
    </>
  )
}

export default MainLayout
