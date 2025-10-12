<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Song from '../components/Song.vue'
</script>

<template>
<div class="root-div">
    <h1>EGGMUNKEE MUSIC</h1>
    <Song url="@/assets/Lost Cause Caravan.mp3" title="Lost Cause Caravan" />
    <Song url="@/assets/Lemons.mp3" title="Lemons" />
    <Song url="@/assets/Hometown Streets.mp3" title="Hometown Streets" />
    <Song url="@/assets/All I Got.mp3" title="All I Got" />
    <Song url="@/assets/Oddest Of Us.mp3" title="Oddest Of Us" />
    <Song url="@/assets/SandDollarAlgorithms_311_Muse_wip.mp3" title="Sand Dollar Algorithms (311-Muse mashup)" />
    <Song url="@/assets/Indied Down B.mp3" title="Indied Down B" />
</div>
</template>

<style scoped>
.root-div {
    margin: 20px;
    text-align: center;
    font-size: 12pt;
    font-family: 'Georgia' 'Comic Sans' 'Serif' serif;
}
</style>