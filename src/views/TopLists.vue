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
                console.log(a)
                const authorId = a.authors[0]
                router.push({ name: 'reuse', query: { work: id, author: authorId } }).then(() => { router.go(0) })
            })
    }

</script>

<template>
    <div class="topLists">
      <div class="list">
        <ol>
          <h2>Författare</h2>
          <li v-for="topAuthor in topAuthors" class="clickable" @click="goToAuthor(topAuthor.id)">
                {{ topAuthor.name }}
          </li>
        </ol>
      </div>
      <div class="list">
        <ol>
          <h2>Verk</h2>
          <li v-for="topTitle in topTitles" class="clickable"  @click="goToWork(topTitle.id)">
            {{ topTitle.title }}
          </li>
        </ol>
      </div>
    </div>
</template>