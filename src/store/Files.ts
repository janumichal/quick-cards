import { useFileDialog } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useCardsStore } from './Cards';

export const useFilesStore = defineStore("files", () => {
  const cStore = useCardsStore();
  const { open, reset, onChange } = useFileDialog({
    accept: "image/jpg, image/png, image/jpeg",
    multiple: false
  })


  onChange((files: FileList|null) => {
    if(files != null){
      convertFileToString(files[0]).then(res => {
        cStore.getEditedCard().value.image = {name: files[0].name, data: res}
      });
    }
  });

  function openFile(event: Event):void{
    open();
    event.preventDefault();
  }

  function resetFile(event: Event){
    cStore.getEditedCard().value.image = null;
    reset();
    event.preventDefault();
  }

  function convertFileToString(file: File): Promise<string> {
    const reader: FileReader = new FileReader()
    return new Promise((resolve) => {
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result)
        }
      }
    })
  }

  return {
    openFile, resetFile,
    convertFileToString
  }
})