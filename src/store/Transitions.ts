import { defineStore} from "pinia"
import { ref, nextTick } from "vue"
import type { Ref } from "vue"

export const useTransitionsStore = defineStore("transitions", () => {
    
    const transitionCount: Ref<number> = ref(0)

    function inTransition():boolean{
        return transitionCount.value > 0
    }

    function addTransition():void{
        transitionCount.value++
    }

    function removeTransition():void{
        if(transitionCount.value > 0){
            transitionCount.value--
        }
    }

    function waitForTransitions():Promise<number>{
        return new Promise((resolve) => {
            nextTick(() => {
                function checkCondition(){
                    if(inTransition()){
                        setTimeout(checkCondition, 100)
                    }else{
                        resolve(0);
                    }
                }
                checkCondition()
            })
        })
    }

    function init():void{
        transitionCount.value = 0
    }

    return {
        inTransition, addTransition, removeTransition, waitForTransitions, init
    }
})