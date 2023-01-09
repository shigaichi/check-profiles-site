import { Card, CardBody, Link, Text } from '@chakra-ui/react'
import { Trans } from 'next-i18next'

const WapInfo = () => (
  <Card>
    <CardBody>
      <Text>
        <Trans
          ns="techs"
          i18nKey="wapAside"
          components={{
            l: (
              <Link
                textDecoration={'underline'}
                href={'https://www.wappalyzer.com/'}
              />
            ),
          }}
        />
      </Text>
    </CardBody>
  </Card>
)

export default WapInfo
