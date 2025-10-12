<script setup>
import { ref } from 'vue'
import AMHighlights from '../components/AMHighlights.vue'
const timeTil2024 = ref(computeTileTil2024())
function computeTileTil2024() {
  const now = new Date()
  const target = new Date(2024, 10, 8, 19, 0, 0)
  const diff = target - now
  const diffSeconds = Math.floor(diff / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffMonths / 12)
  return {
    years: -diffYears,
    months: -(diffMonths % 12),
    days: -(diffDays % 30),
    hours: -(diffHours % 24),
    minutes: -(diffMinutes % 60),
    seconds: -(diffSeconds % 60)
  }
}
setInterval(() => {
  timeTil2024.value = computeTileTil2024()
}, 1000)
</script>

<template>
  <main>
    <div class="countdown">
      <strong class="blue">47 is Hapbenning!</strong>
      <span class="countup">
        <strong class="blue">+{{ timeTil2024.months }}</strong> months,
        <strong class="blue">{{ timeTil2024.days }}</strong> days,
        <strong class="blue">{{ timeTil2024.hours }}</strong> hrs,
        <strong class="blue">{{ timeTil2024.minutes }}</strong> mins,
        <strong class="blue">{{ timeTil2024.seconds }}</strong> secs in...
      </span>
    </div>
    <AMHighlights />
  </main>
</template>

<style scoped>
.countdown {
  text-align: center;
  font-size: 1.2rem;
  margin: 2rem 0;
}
.countup {
  font-size: 1.1rem;
  margin: 3rem 1rem;
}
</style>
