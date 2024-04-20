import { iCard } from "./CardInterface"

export interface iSettings {
    isAddCardButtonVisible: boolean
    isLimitColumnsEnabled: boolean
    columnCount: number
    isDragAndDropEnabled: boolean
    isBackgroundImageEnabled: boolean
    backgroundColor: string
}

export interface iSettingsObject {
    cards: iCard[]
    backgroundColor: string
    backgroundImage: string|null
    isBackgroundImageEnabled: boolean
    columnCount: number
    isLimitColumnsEnabled: boolean
    isAddCardButtonVisible: boolean
}