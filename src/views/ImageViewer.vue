<template>
  <div id="viewer"></div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import OpenSeadragon from 'openseadragon'

export default {
  props: ['id'],
  setup(props) {
    const viewer = ref(null)

    onMounted(async () => {
      const module = await import(`@/assets/gallery/${props.id}.jpeg`)
      const image = module.default
      
      viewer.value = OpenSeadragon({
        id: 'viewer',
        tileSources: {
          type: 'image',
          url: image,
        },
        prefixUrl: '/openseadragon/', // Set the base URL for relative URLs
        showNavigationControl: true,
        sequenceMode: true, // Enable sequence mode
        showReferenceStrip: true,
      })
    })

    return {
      viewer
    }
  }
}
</script>

<style scoped>
#viewer {
  height: 600px;
  width: 800px;
}
</style>
