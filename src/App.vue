<template>
  <div class="super-container">
    <Waiter></Waiter>
    <div class="top">
      <a href="https://litteraturbanken.se">
        <div class="lb-logo-container"></div>
      </a>

      <div class="nav-content">

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
          <template #default>
            <collection-search></collection-search>
          </template>
        </Suspense>
      </div>
      <div class="right-column">
        <div class="right-view-container">
          <Suspense>
            <template #default>
              <div class="right-view-container-content">
                <router-view :key="$route.path"></router-view>
              </div>
            </template>
          </Suspense>
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
import Waiter from "@/components/Waiter.vue";
const route = useRoute();
const isActive = (routeName: string) => {
  if (route.path === "/") {
    return routeName === "/about/";
  }
  return (<string>route.path).indexOf(routeName) > -1;
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
<style>
.active {
  opacity: 1;
}

.nav-content .title {
  padding-top: 0px;
}

.nav-content .sub-title {
  padding-left: 0px;
}
</style>