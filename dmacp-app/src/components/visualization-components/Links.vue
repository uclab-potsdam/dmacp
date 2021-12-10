<template>
    <g class="individual-links">
    </g>
</template>

<script>

export default {
  name: 'Links',
    props: {
      linksData: Array
  },
  mounted () {
    console.log(this.linksData)
  }
}
</script>