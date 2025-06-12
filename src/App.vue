<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>

* {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
  }

html, body {
     width: 100%;
     height: 100%;
     background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

#app {
    display: flex;
    flex-direction: column;   /* if you ever add a header/footer */
    width: 100vw;
    height: 100vh;
  }

  /* router-view’s rendered element will now flexibly fill #app */
#app > * {
    flex: 1 1 auto;
  }
 </style>