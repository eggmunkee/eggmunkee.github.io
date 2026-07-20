<script setup>
// Basic instructions component
defineProps({});
</script>

<template>

<div class="centered-div">
    <div class="instructions blue over-bg-shadow over-bg-area-shadow">
        double click to play a song <span class="minor-slash">/</span> click <span class="download-icon blue-dimmed-bg">&nbsp;</span> icon to download
    </div>
</div>

</template>

<style scoped>
.centered-div {
    display: flex;
    justify-content: center;
}
.instructions {
    text-align: center;
    margin: 0.5em 0;
    font-size: 12pt;
    position: relative;
}
</style>