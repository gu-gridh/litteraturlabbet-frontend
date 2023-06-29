<template>
  <div class="main-container">
    <div class="left-column">
      <div class="lb-logo-container"></div>

      <div class="ll-logo-container">Litteratur<br />Laboratoriet</div>
      <nav class="nav-links" style="min-height:20px;">
        <!-- <router-link to="/" class="nav-link">Välkommen</router-link> -->
      </nav>

      <Suspense>
        <collection-search></collection-search>
      </Suspense>
    
    </div>
    <div class="right-column">
      <div class="right-view-container">
        <nav class="nav-links">
          <router-link to="/about/" class="nav-link">Om laboratoriet</router-link>
          <router-link to="/reuse/" class="nav-link">Textåterbruk</router-link>
          <!--<router-link to="/embedding" class="nav-link"
            >Ordvektorer</router-link
          >-->
          <router-link to="/gallery" class="nav-link">Grafiska element</router-link>
        </nav>
        <div class="right-view-container-content">
          <Suspense>
            <router-view />
          </Suspense>
        </div>
      </div>
    </div>
  </div>

  <Footer></Footer>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Footer from "@/components/Footer.vue";
import CollectionSearch from "./components/CollectionSearch.vue";
import { watch } from "vue";
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>
html,
body {
  height: auto !important;
  width: 100% !important;
  margin: 0 !important;

  font-family: "Barlow Condensed", sans-serif !important;
   background: linear-gradient(
    to right,
    rgb(240, 240, 240) 0%,
    rgb(250, 250, 250) 100%
  ) !important; 
}
  /* background: linear-gradient(
    to right,
    rgb(80, 57, 108) 0%,
    rgb(168, 107, 75) 50%,
    rgb(255, 144, 39) 100%
  ) !important; 
}*/

/* .bgmask {
        width: 100%;
        height:2000px;
        background:url("@/assets/lbbgmask.png");
        background-color:green;
        background-repeat: no-repeat;
        background-position:bottom;
     background-size:cover%;
        opacity: 1.0;
       position:absolute;
       margin-top:calc(105% - 2000px); 

} */

.back-button{
  padding:3px 5px 3px 25px;
  font-size:18px;
  font-weight:500;
  text-align:center;
  color:white;
  border-radius:8px;
  cursor:pointer;
  height:auto;
  width:105px;
  margin:30px;
  margin-left:2.4em;
  background-color:black;
  background-image: url("@/assets/interface/linkbuttonboldwhite.png") !important;
  background-repeat:no-repeat;
  background-size:30px;
  background-position:4px 3px;
}

.author-name,
.work-title {
  background-color: rgb(180,100,100);
  color: white;
  padding: 0.2rem 0.5rem 0.3rem 0.5rem;
  border-radius: 8px;
  font-weight:500;
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

a:hover {
}

#app {
  height: inherit;
  width: inherit;
  padding: 0 0 0 0 !important;
  margin: 0 0 0 0 !important;
  /* display: flex !important; */
}

.ll-logo-container {
  font-family: "Cormorant Garamond", serif;
  letter-spacing: -6px;
  color: rgb(180,100,100);
  width: 100%;
  font-size: 100px;
  line-height: 0.75;
  margin-top: 20px;
  margin-bottom: 35px;
  margin-left: 0px;
  height: 145px;
  z-index: 1;
  transition: all 0.2s ease-in-out;
}

.lb-logo-container {
  margin-top: 50px;
  margin-left: -10px;
  width: 80px;
  height: 80px;
  background-image: url("@/assets/lblogored.png") !important;
  background-size: 80px;
  z-index: 1;
  transition: all 0.2s ease-in-out;
}

.nav-links {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  column-gap: 1rem;
  width: 100%;
  z-index: 1;
  margin-left: -5px;
}

.nav-link {
  font-size: 25px;
  font-weight: 300;
  padding: 0rem 0.5rem 0rem 0.5rem;
  margin-right: 0.25rem;
  border-radius: 8px;
  background-color: rgb(255, 255, 255, 0);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.nav-link:hover {
  opacity: 1;
  background-color: rgb(220, 220, 220);
  color: black;
}



.super-main-container {
  display: flex;
  flex-direction: column;
}

.main-container {
  display: flex;
  flex-direction: row;
  float: left;
  min-height: calc(100vh - 200px);
  margin-bottom: 20px;
  width: 100%;
}

.left-column {
  float: left;
  width: 30%;
  min-width: 350px;
  padding-left: 80px;
  display: flex;
  flex-direction: column;
  align-items: left;
  transition: all 0.2s ease-in-out;
}

.right-column {
  display: flex;
  flex-direction: column;
  min-width: 600px;
  width: 70%;
  height: auto;
  transition: all 0.2s ease-in-out;
}

.right-view-container {
  width: 85%;
  margin: auto;
  margin-top: 310px;
}

.right-view-container-content {
  background-color: white;
  border-radius: 12px;
  background-color: white;
  border-radius: 10px;
  min-height: 480px;
  overflow: hidden;
  padding-bottom: 0px;
  z-index: 1;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
}

.search-container {
  margin-left: 0px;
  width: 100%;
  height: 400px;
  background-color: rgb(255, 255, 255, 1);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: space-between;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 24px;
  z-index: 1;
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
  font-size:1.5em !important;
  letter-spacing: -3px;
  padding-left:35px;
  margin-top: 30px;
  font-size: 30px;
  line-height: 0.9;
  text-align: left;
  color: black;
}

.module-content {
  color: black;
  font-size: 18px;
  padding: 20px 40px 20px 35px;
  text-align: justify;
  line-height: 1.15;
}

@media screen and (max-width: 950px) {
  .ll-logo-container {
    font-size: 140px;
    height: 240px;
  }

  .lb-logo-container {
    width: 120px;
    height: 120px;
    background-image: url("@/assets/lblogoblack.png") !important;
    background-size: 120px;
  }

  .nav-link {
    font-size: 35px !important;
    padding: 0rem 0.5rem 0rem 0.5rem;
    margin-right: 0.25rem;
    border-radius: 10px;
  }

  .select-label {
    font-size: 25px !important;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }

  .count-label {
    font-size: 25px !important;
  }

  .search-container {
    height: 480px;
  }

  .multiselect {
    --ms-font-size: 2.2rem;
    --ms-option-font-size: 1.8rem;
  }

  .search-button {
    font-size: 35px;
    color: white;
    background-color: rgb(180, 80, 80);
    border-color: none !important;
    border-radius: 10px;
    border: 0px solid transparent !important;
    margin-bottom: 1.5rem;
    position: absolute;
    margin-left: -30px;
  }

  .main-container {
    display: block;
    padding: 0px 60px 20px 60px;
  }

  .left-column {
    padding-left: 0px;
    height: auto;
    width: 100%;
    display: block;
    float: left;
    min-width: 600px;
  }
  .right-column {
    width: 100%;
    min-width: 600px;
    height: auto;
    display: block;
    float: left;
  }

  .right-view-container {
    width: 100%;
    margin-top: 50px;
  }
}
</style>
