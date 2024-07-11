import { iFile } from "./FileInterface"

export interface iSettings {
    columnCount: number
    backgroundColor: string
    backgroundImage: iFile|null
    isBackgroundImageEnabled: boolean
    isLimitColumnsEnabled: boolean
    isDragAndDropEnabled: boolean
    isAddCardButtonEnabled: boolean
    cardNameEnabled: boolean
    cardEditEnabled: boolean
}