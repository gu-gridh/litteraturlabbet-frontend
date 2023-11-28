<template>
  <div class="super-container">
    <Waiter></Waiter>
    <div class="top">
      <a href="https://litteraturbanken.se">
      <div class="lb-logo-container"></div>
    </a>

      <div class="nav-content">
        <div class="nav-item"><a href="https://litteraturbanken.se" class="nav-link">LITTERATURBANKEN </a>
          <div class="nav-ornament" v-bind:class="{active: isActive('/home/')}"></div>
        </div>
        <div class="nav-item"><router-link to="/about/" class="nav-link title">LITTERATURLABORATORIET</router-link>
          <div class="nav-ornament" v-bind:class="{active: isActive('/about/')}"></div>
        </div>
        <div class="nav-item sub-title"><router-link to="/gallery/" class="nav-link">• GRAFISKA ELEMENT</router-link>
          <div class="nav-ornament" v-bind:class="{active: isActive('/gallery/')}"></div>
        </div>
        <div class="nav-item sub-title"><router-link to="/reuse/" class="nav-link">• TEXTÅTERBRUK</router-link>
          <div class="nav-ornament" v-bind:class="{active: isActive('/reuse/')}"></div>
        </div>
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
          <div class="right-view-container-content">
            <Suspense>
              <router-view :key="$route.path"></router-view>
            </Suspense>
          </div>
        </div>
      </div>

    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import CollectionSearch from "./components/CollectionSearch.vue";
import { watch } from "vue";
import Waiter from "@/components/Waiter.vue";
import { isBusy } from "@/components/Waiter.vue";

const route = useRoute();
const isActive = (routeName: string) => {
  if (routeName === "/home/") {
    return route.path === "/";
  }
  return (<string>route.path).indexOf(routeName) > -1;
};

</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>
.active {
  opacity: 1;
}

.nav-content .title{
  padding-top:0px;
}

.nav-content .sub-title{
  padding-left:0px;
}
</style>
