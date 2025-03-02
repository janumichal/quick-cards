import { iFile } from "./FileInterface"

export interface iCard {
  url: string
  name: string
  color: string
  image: iFile|null
  isSpacer: boolean
}