<template>
    <div id="metadata-container">
    <div class="metadata-column-group">
      <h1> <span> {{ image.page.work.modernized_title}} </span> </h1>
    <div class="metadata-column">
      <table>
     <tr><td class="label">Author</td><td class="data">  {{ data.page.work.main_author.name }}</td></tr>
     <tr><td class="label">Year</td><td class="data">  {{ data.page.work.year }}</td></tr>
     <tr><td class="label">Page</td><td class="data">  {{ data.page.number }}</td></tr>
     <tr><td class="label">Image Type</td><td class="data">{{ data.label_sv }}</td></tr>
     <tr><td class="label">LB Id</td><td class="data">  {{ data.page.work.lbworkid }}</td></tr>
    </table>
    <div class="button-container">
      <a :href="lbLink" target="_blank" rel="noopener noreferrer" class="visit-button" id="visit">View in Context</a>
    </div>
  </div>
  </div>
  <!-- Masonry wall for similar images -->
  <!-- Masonry wall for recurring images in work, clicking on image should direct to lb page viewer -->
  </div>
  </template>
  
  <script>
  import { useStore } from '../stores/store.js';
  
  export default {
    props: {
      Id: {
        type: [Number, String],
        required: false,
        default: null,
      },
    },
    data() {
      return {
        data: {},
        coordinateStore: useStore(),
        lbLink:''
      };
    },
     mounted() {
      // Fetch ID from URL and populate data
      this.extractIdAndFetchData();
    },
     methods: {
      fetchData(id) {
        fetch(`https://diana.dh.gu.se/api/litteraturlabbet/graphic/?id=${id}&depth=3`)
          .then((response) => response.json())
          .then((json) => {
            this.data = json.results[0];
            this.lbLink = 'https://litteraturbanken.se/f%C3%B6rfattare/' + data.page.work.main_author.lbauthorid + '/titlar/' + data.page.work.modernized_title + '/sida/' + data.page.number + '/faksimil'
          })
          .catch((error) => {
            console.error('Error fetching image data:', error);
          });
      },
    },
  };
    
  </script>
  <style scoped>
  
  #metadata-container{
    max-width:100%;
    padding:0px!important;
    overflow:hidden;
  }
  
  h1{
    min-height:00px;
    width:100%;
    font-size:1.8em;
    text-align:left;
    color:white;
    padding-left:25px;
    margin-top:20px;
    margin-bottom:10px;
  }
  
  h2{
    width:100%;
    font-size:1.3em;
    text-align:left;
    color:white;
    padding-left:0px;
    margin-top:20px;
    margin-bottom:15px;
  }
  
  .metadata-column-group {
    float:left;
   width:95%;
  }
  
  .metadata-column {
    float:left;
    padding-left: 25px;
    color: white;
    line-height: 1;
  }
  
  
  .label {
    width:120px;
    color:white;
    font-weight:600;
  }
  
  .data {
    color: rgb(200,225,250);
  max-width:180px;
  
  }
  
  .ref {
    color: rgb(200,225,250);
  max-width:100%;
  margin-top: 0px;
  }
  
  table, th, td {
    max-width:100%;
  }
  
  .metadata-wide {
    float:left;
   padding-left:25px;
    color: white;
    max-width:100%;
    margin-top:10px;
  }
  
  
  ul {
    float:left;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0;
    margin: 0;
  }
  
  .keywords {
    float:left;
    margin-bottom: 30px;
    width:100%;
  }
  
  .description {
    width:90%;
    margin-bottom: 30px;
  }
  
  .disclaimer{
    width:90%;
    margin-bottom: 10px;
    color:rgb(200,225,250);
    font-weight: 500;
  }
  
  .visit-button {
    display: inline-block;
    padding: 4px 10px 4px 43px;
    color: white;
    background-color: rgb(100, 100, 100);
    border-radius: 8px;
    font-size:1.15em;
    text-decoration: none;
    cursor: pointer;
    margin-bottom: 20px;
    background-image:url(../../public/interface/linkbuttonwhite.png);
    background-size:20px;
    background-position:10px 8px;
    background-repeat:no-repeat;
    box-shadow:5px 5px 10px rgba(0,0,0,0.1);
  }
  
  .visit-button:hover {
    background-color: rgb(80,90,100);
    color:white;
  }
  
  .button-container {
    display: flex;
    justify-content: left;
  }
  
  ul li {
    float:left;
    list-style-type: none;
    padding: 2px 8px;
    border-radius: 5px;
    background-color: rgb(100, 100, 100); 
  }
  
  @media screen and (min-height: 950px) {
    .visit-button {
      padding: 4px 15px 6px 50px;
    background-size:30px;
  }
  }
  </style>
  