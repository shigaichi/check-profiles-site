import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRedirect = (to: string): void => {
  const router = useRouter()
  to ??= router.asPath

  useEffect(() => {
    const locale = navigator.language
    const detectedLng =
      locale.toLowerCase().includes('ja') || locale.toLowerCase().includes('jp')
        ? 'ja'
        : 'en'

    if (to.startsWith('/' + detectedLng) && router.route === '/404') {
      // prevent endless loop
      router.replace('/' + detectedLng + router.route)
      return
    }
    console.log(detectedLng)

    router.replace('/' + detectedLng + to)
  })
}

export const Redirect = () => {
  useRedirect('/')
  // return <></>
}

// eslint-disable-next-line react/display-name
// export const getRedirect = (to) => () => {
//     useRedirect(to)
//     return <></>
// }
