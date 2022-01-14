<template>
  <defs>
    <filter id="blur" x="-75" y="-75" :width="sizes.width" :height="sizes.height">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" edgeMode="wrap"/>
    </filter>
    <filter id='noise' x='0%' y='0%' width='100%' height='100%'>
      <feTurbulence baseFrequency="1" />
    </filter>
    <linearGradient id="begin-grad" x1="0%" y1="0%" x2="30%" y2="0%">
      <stop offset="0%" style="stop-color:rgb(78, 86, 94, 0.438);stop-opacity:1"/>
      <stop offset="50%" style="stop-color:rgb(78, 86, 94);stop-opacity:0" />
    </linearGradient>
    <linearGradient id="end-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:rgb(78, 86, 94);stop-opacity:0"/>
      <stop offset="100%" style="stop-color:rgb(78, 86, 94, 0.438);stop-opacity:1" />
    </linearGradient>
    <linearGradient id="precedes-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#8482FF;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:rgb(90, 85, 238);stop-opacity:1" />
    </linearGradient>
    <linearGradient id="follows-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8482FF;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:rgb(41, 39, 117);stop-opacity:1" />
    </linearGradient>
  </defs>
</template>

<script>
// TO DO: Create gaussian blurs for all stages of uncertainty, range 0 to 1
export default {
  name: 'Filters',
  props: {
      sizes: Object
  }
}
</script>