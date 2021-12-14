<template>
  <button type="button" :class="classes" @click="onClick" :style="style">{{ label }}</button>
</template>

<script>
import './button.css';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'my-button',

  props: {
    label: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'medium',
      validator: function (value) {
        return ['extra-small', 'small', 'medium', 'large'].indexOf(value) !== -1;
      },
    },
    backgroundColor: {
      type: String,
    },
  },

  computed: {
    ...mapState(['compress', 'events', 'relations']),
    classes() {
      return {
        'storybook-button': true,
        'storybook-button--active': this.active,
        'storybook-button--inactive': !this.active,
        [`storybook-button--${this.size}`]: true,
      };
    },
    style() {
      return {
        backgroundColor: this.backgroundColor,
      };
    },
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
};
</script>
