import { MarketsType } from 'consts/markets'
import jpFeaturedTechs from 'data/jp/techs/focusedTechCategories.json'
import usFeaturedTechs from 'data/us/techs/focusedTechCategories.json'
import { FocusedTechCategories } from './FocusedTechCategories'

export const getFocusedTechCategories = (
  market: MarketsType
): FocusedTechCategories[] => {
  switch (market) {
    case 'jp':
      return jpFeaturedTechs.focusedTechCategories
    case 'us':
      return usFeaturedTechs.focusedTechCategories
  }
}
