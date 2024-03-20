<template>
 
  <div id="viewer">
    <div id="ToolbarVertical">
      <div class="close-button NavButton" onclick="history.back()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="-2 -2 28 28" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M6 18L18 6M6 6l12 12" /></svg>
      </div>
      <!-- <a id="full-page" href="#full-page">
        <div id="FullPage" class="NavButton"></div>
      </a> -->
      <a id="zoom-in" href="#zoom-in">
        <div id="ZoomIn" class="NavButton"></div>
      </a>
      <a id="zoom-out" href="#zoom-out">
        <div id="ZoomOut" class="NavButton"></div>
      </a>
    </div> 

  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { setBusy, setNotBusy } from "../components/Waiter.vue"; 

import OpenSeadragon from 'openseadragon';

export default {
  props: ['id'], 
  setup(props) {
    const viewer = ref();

    onMounted(async () => {
      setNotBusy();

      try {
        const response = await fetch(`https://diana.dh.gu.se/api/litteraturlabbet/graphic/?id=${props.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const iiifFile = data.results[0]?.iiif_file;

        if (iiifFile) {
          viewer.value = OpenSeadragon({
            id: 'viewer',
            tileSources: `${iiifFile}/info.json`,
            prefixUrl: '/openseadragon/',
            showNavigationControl: true,
            showReferenceStrip: true,
            immediateRender: true,
            visibilityRatio: 1.0,
            minZoomImageRatio: 1.0,
            homeFillsViewer: false,
            showZoomControl: true,
            showHomeControl: false,
            showFullPageControl: true,
            showNavigator: false,
            navigatorAutoFade: true,
            fullPageButton: "full-page",
            zoomInButton: "zoom-in",
            zoomOutButton: "zoom-out",
          });
        } else {
          console.error("IIIF file URL not found in the API response.");
        }
      } catch (error) {
        console.error("Error fetching IIIF image data:", error);
      }
    });

    return {
      viewer,
    };
  },
};
</script>

<style scoped>
#viewer {
  position:absolute;
  height:100%;
  width: 100%;
}

.close-button{
  font-size:16px;
  text-align:center;
  cursor:pointer;
  background-color: rgba(35, 35, 35, 0.9);
}

#navigatorDiv{
  position:absolute;
  width:80px;
  height:80px;
  margin-top:10px;
  margin-right:10px;

}

#ToolbarHorizontal {
  position: absolute;
  display: flex;
  bottom: 10px;
  width: 100%;
  z-index: 1000;
}
#CenterNav {
  margin: auto;
}
#ToolbarHorizontal span {
  background-color: rgba(35, 35, 35, 0.6);
  color: white;
  text-align: center;
  padding: 5px 10px 5px 10px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  vertical-align: 13px;
  margin-left: 10px;
  margin-right: 10px;
}

#ToolbarVertical {
  position: absolute;
  margin-top: 20px;
  width: 40px;
  margin-left: 22px;
  z-index: 1000;

}

#FullPage {
  margin-top: 30px;
  background: url(../assets/openseadragon/expand.svg);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  overflow: hidden;
}

#Prev {
  background: url(../assets/openseadragon/prev.png);
  background-size: 35px 35px;
  background-color: rgba(35, 35, 35, 0.9);
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: relative;
}

#Next {
  background: url(../assets/openseadragon/next.png);
  background-size: 35px 35px;
  background-color: rgba(35, 35, 35, 0.9);
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
  position: relative;
}

#ZoomIn {
  margin-top: 30px;
  background: url(../assets/openseadragon/plus.svg);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);


  overflow: hidden;
}

#ZoomOut {
  background: url(../assets/openseadragon/minus.svg);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  overflow: hidden;
}

#Download {
  margin-top: 20px;
  background: url(../../public/interface/downloadwhite.png);
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: rgba(35, 35, 35, 0.9);
  cursor: pointer;
  overflow: hidden;
}
.NavButton {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  color: white;
  opacity: 0.8;
  margin-bottom: 3px;
}
.NavButton:hover {
  opacity: 1;
}
</style>
