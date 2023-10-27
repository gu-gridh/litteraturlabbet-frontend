<template>
  <div class="super-container">
    <Waiter></Waiter>
    <div class="top">
   <router-link to="/about/" class="nav-link">
      <div class="lb-logo-container"></div>
    </router-link>
      <div class="nav-content">
        <div class="nav-item"><a href="https://litteraturbanken.se" class="nav-link">LITTERATURBANKEN </a><div class="nav-ornament"></div></div>
        <div class="nav-item"><router-link to="/about/" class="nav-link">LITTERATURLABORATORIET</router-link><div class="nav-ornament"></div></div>
        <div class="nav-item"><router-link to="/gallery" class="nav-link">GRAFISKA ELEMENT</router-link><div class="nav-ornament"></div></div>
        <div class="nav-item"><router-link to="/reuse/" class="nav-link">TEXTÅTERBRUK</router-link><div class="nav-ornament"></div></div>
      </div>
    </div>

    <div class="main-container">
      <div class="left-column">
        <Suspense>
          <collection-search></collection-search>
        </Suspense>

      </div>
      <div class="right-column">
        <div class="right-view-container">
          <!--    <nav class="nav-links">
          <router-link to="/about/" class="nav-link">Om laboratoriet</router-link>
          <router-link to="/reuse/" class="nav-link">Textåterbruk</router-link>
          <router-link to="/embedding" class="nav-link"
            >Ordvektorer</router-link
          <router-link to="/gallery" class="nav-link">Grafiska element</router-link>
        </nav> -->
          <div class="right-view-container-content">
            <Suspense>
              <router-view :key="$route.path"></router-view>
            </Suspense>
            <!--           
          <div class="loader-container" v-show="!isBusy"> 
          <div class="loader"></div> 
          
        </div>-->

          </div>
        </div>
      </div>

    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Footer from "@/components/Footer.vue";
import CollectionSearch from "./components/CollectionSearch.vue";
import { watch } from "vue";
import Waiter from "@/components/Waiter.vue";
import { isBusy } from "@/components/Waiter.vue";

</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>

</style>
