import { iCard } from "./CardInterface"
export interface iExport {
    cards: iCard[]
    columnCount: number
    backgroundColor: string
    backgroundImage: string|null
    isBackgroundImageEnabled: boolean
    isLimitColumnsEnabled: boolean
    isDragAndDropEnabled: boolean
    isAddCardButtonEnabled: boolean
    cardNameEnabled: boolean
    cardEditEnabled: boolean
}