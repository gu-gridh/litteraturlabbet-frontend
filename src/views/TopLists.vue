<script setup lang="ts">
import  topList from "@/assets/topList.json"
import type { Work, Author } from "@/types/litteraturlabbet";
import { getByLbId, get } from "@/services/diana";
import { ref } from 'vue';
import router from '@/router/index'
import { setBusy } from "@/components/Waiter.vue";
import { searchStore } from "@/stores/search";

const topTitles = ref(topList.titles)
const topAuthors = ref(topList.authors)
const store = searchStore();

const goToAuthor = async (id: number) => {
  setBusy();
  const author = await get<Author>(id, "author");
  store.author = author;
  router.push({ name: 'reuse2', params: { author: id } }); 
}
const goToWork = async (id: number, aid: number) => {
  setBusy();
  const work = await get<Work>(id, "work");
  store.work = work;
  router.push({ name: 'reuse2', params: { work: id, author: aid } }); 
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
          <li v-for="topTitle in topTitles" class="clickable"  @click="goToWork(topTitle.id, topTitle.aid)">
            {{ topTitle.title }}. {{ topTitle.author }}
          </li>
        </ol>
      </div>

    </div>
</template>

<style scoped>

h1{
  font-family: "Cormorant Garamond", serif;
  font-weight:400;
  padding-left:35px; 
  padding-bottom:5px;
  padding-top:15px;
  letter-spacing: -2px;
  color:black !important;
}

h2{
  font-family: "Cormorant Garamond", serif;
  font-weight:300;
  color:black;
  letter-spacing: -2px;
  padding-bottom:5px;
}
.topLists {
  color:black !important;
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