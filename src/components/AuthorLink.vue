<script setup lang="ts">
import { reuseStore } from '@/stores/reuse';
import { get } from "@/services/diana";
import type { Author } from "@/types/litteraturlabbet";

const store = reuseStore();
const auth1 = await get<Author>(store.author1 as number, "author");
const auth2 = await get<Author>(store.author2 as number, "author");


</script>

<template>
   <div class="back-button" onclick="history.back()">Tillbaka</div>
    <div class="link-container">
        <h2>Textåterbruk mellan <span class="author-name">{{ auth1.name }}</span> och <span class="author-name">{{ auth2.name }}</span></h2>
    </div>
    
</template>

<style scoped>
.link-container {
    margin: 20px;
    margin-left:3.5em;
    font-size: 14px;
}
</style>