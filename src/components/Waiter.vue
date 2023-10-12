<template>
   <div id="waiter" v-show="isBusy">
    <div id="waiter-wrapper">
        <div id="waiter-text">
            <p>Laddar</p>
        </div>
        <div id="waiter-spinner">
        
        <svg class="spinner" width="50" height="50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="5" fill="#b46464" stroke-width="5" stroke="#b46464" />
            <circle cx="25" cy="25" r="20" fill="none" stroke-width="5" stroke="#b46464" stroke-dasharray="20 10" />
            <circle cx="25" cy="25" r="30" fill="none" stroke-width="5" stroke="#b46464" stroke-dasharray="3 2" />
        </svg>
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
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: rgba(0, 0, 0, 0.651);
  }

  #waiter-text {
    font-size: 3rem;
    color: #e7bfbf;
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
  