import { Card, CardBody, ListItem, UnorderedList } from '@chakra-ui/react'
import { Markets } from 'consts/markets'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

const AsideInfo = () => {
  const { t } = useTranslation(['techs'])
  const router = useRouter()

  return (
    <Card>
      <CardBody>
        <UnorderedList>
          <ListItem>{t('targetAside')}</ListItem>
          <ListItem>{t('siteAside')}</ListItem>
          <ListItem>{t('universeAside')}</ListItem>
          <ListItem>{t('companyNumberAside')}</ListItem>
          <ListItem>{t('periodAside')}</ListItem>
          {router.query.market === Markets.US && (
            <>
              <ListItem>{t('fundsAside')}</ListItem>
              <ListItem>{t('multipleAside')}</ListItem>
            </>
          )}
        </UnorderedList>
      </CardBody>
    </Card>
  )
}

export default AsideInfo
