<template>
	<Home />
</template>


<script setup lang="ts">
import { iCard } from "./Interfaces/CardInterface";
import { ref } from "vue";
import { useCardsStore } from "./store/Cards";
import Home from "./views/Home.vue"

const cStore = useCardsStore()

browser.menus.create({
	id: "add-card",
	title: "Add to quick cards",
	type: "normal",
	contexts: ["tab", "bookmark"]
})

browser.menus.onClicked.addListener((info) => {
	if (info.menuItemId === "add-card") {
		if(info.pageUrl != undefined){
			var card: iCard = {
				url: info.pageUrl,
				name: getNameFromURL(info.pageUrl),
				color: "#CCCCFF",
				image: null,
        isSpacer: false
			}
			cStore.setEditedCard(ref(card))
      cStore.saveEditedCard()
		} else if (info.bookmarkId != undefined){
			var bookmark = browser.bookmarks.get(info.bookmarkId)
			bookmark.then(res => {
				if(res[0].url != undefined){
					var card: iCard = {
						url: res[0].url,
						name: getNameFromURL(res[0].url),
						color: "#CCCCFF",
						image: null,
            isSpacer: false
					}
          cStore.setEditedCard(ref(card))
					cStore.saveEditedCard()
				}
			})
		}
	}
});


function getNameFromURL(url: string){
	const regex = new RegExp("^https?:\/\/(?:www\.)?([^.]+)\..*")
	const found = url.match(regex)
	
	if(found != null){
		return found[1]
	}
	return ""
}

</script>

<style lang="scss">
    @use "./scss";
</style>