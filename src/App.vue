<template>
  <div class="super-container">
    <Waiter></Waiter>

    <div class="top">

      <div class="lb-logo-container"></div>

      <!-- <div class="ll-logo-container">Litteratur<br />Laboratoriet</div> -->

      <div class="nav-content">
        <router-link to="/reuse/" class="nav-link">LITTERATURBANKEN</router-link>
        <router-link to="/about/" class="nav-link">LITTERATURLABORATORIET</router-link>
        <router-link to="/gallery" class="nav-link">GRAFISKA ELEMENT</router-link>
        <router-link to="/reuse/" class="nav-link">TEXTÅTERBRUK</router-link>

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
.loader-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  position: absolute;
}

.loader {
  text-align: center;
  height: 100px;
  width: 100px;
  background-image: url("@/assets/interface/Spin-1s-200px.gif");
  background-size: contain;
  margin-top: -40px;
  position: absolute;
}

.back-button {
  padding: 3px 5px 3px 25px;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  height: auto;
  width: 105px;
  margin: 30px;
  margin-left: 2.4em;
  background-color: rgb(150, 150, 150);
  background-image: url("@/assets/interface/linkbuttonboldwhite.png") !important;
  background-repeat: no-repeat;
  background-size: 30px;
  background-position: 4px 3px;
}

.back-button:hover {
  background-color: rgb(120, 120, 120);
}

.author-name,
.work-title {
  background-color: rgb(180, 100, 100);
  color: white;
  padding: 0.2rem 0.5rem 0.3rem 0.5rem;
  border-radius: 8px;
  font-weight: 500;
}


a:link {
  color: black;
  text-decoration: none;
}

a:visited {
  text-decoration: none;
  color: black;
  text-decoration-style: none;
}

#app {
  height: inherit;
  width: inherit;
  padding: 0 0 0 0 !important;
  margin: 0 0 0 0 !important;
  /* display: flex !important; */
}

.lb-logo-container {
  background-image: url("@/assets/lblogowhite.png");
}

.button-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}


button {
  color: black;
  overflow: hidden;
}


.module-title {
  font-family: "Cormorant Garamond", serif;
  pointer-events: none;
  font-size: 1.5em !important;
  letter-spacing: -3px;
  padding-left: 35px;
  margin-top: 0px;
  font-size: 30px;
  line-height: 0.9;
  text-align: left;
  color: black;
}

.module-content {
  color: black;
  font-size: 18px;
  padding: 50px 40px 20px 35px;
  text-align: justify;
  line-height: 1.15;
}
</style>
