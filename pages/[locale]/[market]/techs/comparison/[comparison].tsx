import { Markets, MarketsType } from 'consts/markets'
import i18nextConfig from 'next-i18next.config'

import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import AsideInfo from 'components/common/asideInfo'
import WapInfo from 'components/common/wapInfo'
import { getUsedInitials } from 'features/company/getUsedInitials'
import fs from 'fs'
import { InferGetStaticPropsType, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { useRouter } from 'next/router'
import path from 'path'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Comparison: NextPage<Props> = (props) => {
  const router = useRouter()
  const { t } = useTranslation('comparison')

  const options = {
    plugins: {
      legend: {
        // position: 'top',
      },
      title: {
        display: true,
        text: `${props.category} ${t('marketShareOverTime')}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: t('yAxisLabel'),
        },
      },
    },
    elements: {
      line: {
        tension: 0.5, // This sets the curvature of the line. Set to 0 for no curve.
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <>
      <Head>
        <title>{`${props.category} ${t('marketShareAnalysis')}`}</title>
      </Head>
      <VStack spacing="8" padding={4} align={'stretch'}>
        <Box p={5}>
          <Box borderBottomColor={'black'} borderBottom="1px">
            <Heading as="h1" size="lg">
              {props.category} {t('marketShare')}
            </Heading>
          </Box>

          <Flex direction="column" gap="20px" paddingTop="8">
            <Heading size="md" as={'h2'}>
              {props.category} {t('marketShareOverTime')}
            </Heading>
            <Text>{t('marketShareText')}</Text>

            <Heading size="md" as={'h2'}>
              {t('comparisonText', {
                val: props.chart.datasets
                  .map((dataset) => dataset.label)
                  .join(', '),
              })}
            </Heading>

            <Box height="400px">
              <Line data={props.chart} options={options} />
            </Box>

            <Heading as={'h2'} size="md">
              {t('linkListText')}
            </Heading>
            <UnorderedList>
              {props.chart.datasets
                .filter((dataset) => dataset.link)
                .map((dataset) => (
                  <ListItem key={dataset.label}>
                    <Link
                      href={`/${router.query.locale}/${
                        router.query.market
                      }/techs/${dataset.link.slug.toLowerCase()}/${
                        dataset.link.initial
                      }`}
                      color="teal.500"
                    >
                      {t('linkText', { val: dataset.label })}
                    </Link>
                  </ListItem>
                ))}
            </UnorderedList>
          </Flex>
        </Box>
        <Divider />
        <AsideInfo />
        <WapInfo />
      </VStack>
    </>
  )
}

export default Comparison

const getComparison = (market: MarketsType): Comparison[] => {
  const dataDirectory = path.join(
    process.cwd(),
    'data',
    market,
    'techs',
    'comparison'
  )
  const filenames = fs.readdirSync(dataDirectory)
  const filename = filenames.find((filename) => {
    return filename.endsWith('.json')
  })
  if (filename == null) {
    throw new Error(`No json was found in ${dataDirectory}`)
  }

  const filePath = path.join(dataDirectory, filename)
  const jsonBlob = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(jsonBlob) as Comparison[]
}

export const getStaticPaths = () => {
  return {
    fallback: false,
    paths: i18nextConfig.i18n.locales.flatMap((lng) =>
      Object.values(Markets).flatMap((market) =>
        getComparison(market).map((it) => {
          return {
            params: {
              locale: lng,
              market: market,
              comparison: it.slug,
            },
          }
        })
      )
    ),
  }
}

export const getStaticProps = async (context: any) => {
  const data = getComparison(context.params.market).find(
    (it) => it.slug === context.params.comparison
  )

  if (data == null) {
    throw new Error(`No data was found`)
  }

  const chart = transformData(data.settings, context.params.market)

  return {
    props: {
      chart: chart,
      category: data.category,
      ...(await serverSideTranslations(context.params.locale, [
        'top',
        'techs',
        'comparison',
      ])),
    },
  }
}

type Comparison = {
  category: string
  slug: string
  settings: TechData[]
}

type TechData = {
  techName: string
  data: { [key: string]: number }
  label: string
  borderColor: string
  backgroundColor: string
}

type ChartData = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    fill: boolean
    link: {
      slug: string
      initial: string
    }
  }[]
}

function transformData(jsonData: TechData[], market: MarketsType): ChartData {
  if (jsonData.length === 0) {
    throw new Error('The input JSON is empty.')
  }

  // Extract labels from the first entry
  const labels = Object.keys(jsonData[0].data).sort()

  // Check if all entries have the same keys
  const allKeysMatch = jsonData.every((tech) => {
    const keys = Object.keys(tech.data).sort()
    return JSON.stringify(keys) === JSON.stringify(labels)
  })

  if (!allKeysMatch) {
    throw new Error(
      `Not all tech data entries have the same keys. techs: ${jsonData
        .map((it) => it.techName)
        .join(', ')}`
    )
  }

  // Transform the data into the Chart.js format
  const datasets = jsonData.map((tech) => {
    const dataset: any = {
      label: tech.label,
      data: labels.map((label) => tech.data[label]),
      borderColor: tech.borderColor,
      backgroundColor: tech.backgroundColor,
      fill: true,
    }

    // Conditionally add the 'link' property if the last data point is not 0
    const lastDataPoint = tech.data[labels[labels.length - 1]]
    if (lastDataPoint !== 0) {
      // last data point is 0 == no company uses the tech.
      dataset.link = {
        slug: tech.techName,
        initial: getUsedInitials(tech.techName, market)[0],
      }
    }
    return dataset
  })

  return {
    labels: labels.map((label) => formatDate(label)),
    datasets,
  }
}

const formatDate = (input: string): string => {
  const year = input.slice(0, 4)
  const month = input.slice(4, 6)

  return `${year}/${month}`
}
