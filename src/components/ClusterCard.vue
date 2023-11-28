<template>
   <router-link
          :to="{
            name: 'cluster',
            params: {
              id: cluster.id,
            },
          }"
          >
  <div class="cluster-card">
    <div class="cluster-metadata-container">
      <div>
        <p class="cluster-size-label">{{ cluster.size }} </p> återbruk
       
      </div>
      <div>
        <!-- <router-link
          :to="{
            name: 'cluster',
            params: {
              id: cluster.id,
            },
          }"
          >Utforska</router-link
        > -->
      </div>
    </div>
    <div class="cluster-text-container">
      {{ cluster.segments[0].text.slice(0, 300) }}...
    </div>
  </div>
  </router-link
        >
</template>

<script setup lang="ts">
import type { Cluster } from "@/types/litteraturlabbet";

defineProps<{
  cluster: Cluster;
}>();
</script>

<style scoped>
.cluster-card {
  /* padding: 2rem 1rem 2rem 1rem; */
  margin: 0rem 1rem 1rem 1rem;
  height: 6rem;
  display: flex;
  flex-direction: row;
  cursor:pointer;
  transition: all .2s ease-in-out;
}

.cluster-card:hover {
 transform: scale(1.01);
}

.cluster-text-container {
  width: calc(100% - 150px);
  color: black;
  cursor:pointer;
  border-radius: 10px;
  line-height:1.2;
  padding: 1rem 1rem 1rem 2rem;
  font-style: normal;
  font-size:18px;
   display: flex;
  align-items: center;
  cursor:pointer;
}



.cluster-metadata-container {
  width: 95px;
  height:95px;
  line-height:1.1;
  background-color: var(--theme-main-color);
  text-align:center;
  color: white;
  padding: 1.4rem 1rem 1rem 1rem;
  border-radius: 50%;
  flex-grow: initial;
  font-size: large;
  transition: all .2s ease-in-out;
  margin-left:20px;
}

.cluster-metadata-container:hover {
 transform: scale(1.02);
 background-color:var(--theme-main-color-dark);
 
}

.cluster-size-label {
  font-size: 30px;
}

 @media screen and (max-width: 1150px) {


      .cluster-card {

 margin: 1rem 1rem 5rem 1rem;
 }
 }

  @media screen and (max-width: 950px) {

      .cluster-card {

 margin: 1rem 1rem 5rem 1rem;
  

}

  .cluster-text-container {
      font-size:22px;
  }

  .cluster-size-label {
  font-size: 35px;
}

.cluster-metadata-container {
  width: 120px;
  height:120px;
  margin-top:-0.5em;
  line-height:1.1;
  padding: 1.9rem 1rem 1rem 1rem;

}

 }

</style>
