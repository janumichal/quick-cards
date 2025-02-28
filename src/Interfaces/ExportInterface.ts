import { iCard } from "./CardInterface"
import { iFile } from "./FileInterface"
export interface iExport {
    cards: iCard[]
    columnCount: number
    backgroundColor: string
    backgroundImage: iFile|null
    isBackgroundImageEnabled: boolean
    isLimitColumnsEnabled: boolean
    isDragAndDropEnabled: boolean
    isAddCardButtonEnabled: boolean
    cardNameEnabled: boolean
    cardEditEnabled: boolean
    cardAspectRatioWidth: number
    cardAspectRatioHeight: number
    cardSize: number
}