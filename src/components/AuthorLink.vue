<script setup lang="ts">
import { reuseStore } from '@/stores/reuse';
import { get } from "@/services/diana";
import type { Author } from "@/types/litteraturlabbet";

const store = reuseStore();
const auth1 = await get<Author>(store.author1 as number, "author");
const auth2 = await get<Author>(store.author2 as number, "author");


</script>

<template>
    <div class="link-container">
        <h2>Textåterbruk mellan <span style="font-weight: bold;">{{ auth1.name }}</span> och <span style="font-weight: bold;">{{ auth2.name }}</span></h2>
    </div>
    
</template>

<style scoped>
.link-container {
    margin: 30px;
}
</style>