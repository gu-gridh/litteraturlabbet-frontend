<script setup lang="ts">
import  topList from "@/assets/topList.json"
import type { Work, Author } from "@/types/litteraturlabbet";
import { getByLbId, get } from "@/services/diana";
import { ref } from 'vue';
import router from '@/router/index'

const topTitles = ref(topList.titles.slice(0,10))
const topAuthors = ref(topList.authors.slice(0,10))
    //fetch and add id to json-file
    topAuthors.value.forEach((a: any) => {
        getByLbId<Author>("author", {lbauthorid: a.lbauthorid})
            .then((b: any) => {
                a.id = b.results[0].id
            })
    })
    topTitles.value.forEach((a: any) => {
        getByLbId<Work>("work", {lbworkid: a.lbworkid})
            .then((b: any) => {
                a.id = b.results[0].id
            })
    })


    const goToAuthor = (id: number) => {
        router.push({ name: 'reuse', query: { author: id } }).then(() => { router.go(0) })
    }
    const goToWork = (id: number) => {
        get<Work>(id, "work")
            .then((a: any) => {
                const authorId = a.main_author
                router.push({ name: 'reuse', query: { work: id, author: authorId } }).then(() => { router.go(0) })
            })
    }

</script>

<template>
   <h1 style="">Ofta förekommande återbruk</h1>
    <div class="topLists">
      <div class="list-left">
        <ol>
          <h2>Författare</h2>
          <li v-for="topAuthor in topAuthors" class="clickable" @click="goToAuthor(topAuthor.id)">
                {{ topAuthor.name }}
          </li>
        </ol>
      </div>

      <div class="list-right">
        <ol>
          <h2>Verk</h2>
          <li v-for="topTitle in topTitles" class="clickable"  @click="goToWork(topTitle.id)">
            {{ topTitle.title }}
          </li>
        </ol>
      </div>

    </div>
</template>

<style scoped>

h1{
  font-family: "Cormorant Garamond", serif;
  font-weight:600;
  padding-left:35px; 
  padding-bottom:5px;
  padding-top:15px;
  color:black;
}

h2{
  font-family: "Cormorant Garamond", serif;
  font-weight:600;
  color:black;
  padding-bottom:5px;
}
.topLists {
  display: flex;
  padding-right:20px;
  padding-bottom:30px;
  font-size: 18px;
  width:100%;
}

.list-left {
  flex-grow:1;
  text-align: left;
  max-width:300px;
  min-width:280px;
}

.list-right {
  flex-grow:1;
  text-align: left;
  padding-left:10px;
}

.clickable {
  cursor: pointer;
}

li{
  font-size:18px;
  margin-left:20px;
  border-radius:5px;
  padding:3px 6px;
  line-height:1.1;
  margin-bottom:5px;
}

li:hover{
  background-color:rgb(240,240,240);
}
</style>