<template>
   <div id="waiter" v-show="isBusy">
    <div id="waiter-wrapper">
     
        <div id="waiter-spinner">
        </div>

        <div id="waiter-text">
        </div>
    </div>
   </div>
  </template>
  
  <script lang="ts">
    import { ref } from "vue";

    export default {
        name: "Waiter",
        setup() {
            return { isBusy, setBusy, setNotBusy }
        }
    }    
    const isBusy = ref(true);

    const setBusy = () => {
        isBusy.value = true;
    };

    const setNotBusy = () => {
        isBusy.value = false;
    };

    export { isBusy, setBusy, setNotBusy }
  </script>
  
  <style scoped>
  #waiter {
    position: fixed;
    top: 0px;
    bottom: -1px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: rgba(255, 255, 255, 0.6);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(8px);
  }

#waiter-spinner {
 width:90px;
 height:90px;
 background-image:url("@/assets/1481.png");
 background-size: contain;
 margin-top:-90px;
  }


  #waiter-text {
    font-family: "Barlow Condensed", sans-serif !important;
    font-size: 2rem;
    font-weight:600;
    color: var(--theme-accent-color);
    user-select: none;
  }

  #waiter-wrapper {
    display: flex;  
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
  
  }
  .spinner {
    animation: rotate 2s linear infinite;
    transform-origin: center;
  }
  @keyframes rotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
  }
  </style>
  