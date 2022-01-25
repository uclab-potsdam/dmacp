<template>
  <defs>
    <filter id="blur" x="-75" y="-75" :width="sizes.width" :height="sizes.height">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" edgeMode="wrap"/>
    </filter>
    <linearGradient id="begin-grad" x1="0%" y1="0%" x2="30%" y2="0%">
      <stop offset="5%"  stop-color="#9e9da8" stop-opacity="1" />
      <stop offset="15%" stop-color="#9e9da8" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="end-grad">
      <stop offset="90%"  stop-color="#9e9da8" stop-opacity="0" />
      <stop offset="100%" stop-color="#9e9da8" stop-opacity="1" />
    </linearGradient>
    <linearGradient id="begin-legend" x1="0%" y1="0%" x2="30%" y2="0%">
      <stop offset="5%"  stop-color="#9e9da8" stop-opacity="1" />
      <stop offset="100%" stop-color="#9e9da8" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="end-legend">
      <stop offset="5%"  stop-color="#9e9da8" stop-opacity="0" />
      <stop offset="100%" stop-color="#9e9da8" stop-opacity="1" />
    </linearGradient>
    <linearGradient id="precedes-grad" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#8482FF;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:rgb(90, 85, 238);stop-opacity:1" />
    </linearGradient>
    <linearGradient id="follows-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8482FF;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:rgb(41, 39, 117);stop-opacity:1" />
    </linearGradient>
    <radialGradient id="radial-blurriness">
      <stop offset="5%" stop-color="white" />
      <stop offset="98%" stop-color="#8482FF" stop-opacity="0" />
    </radialGradient>
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