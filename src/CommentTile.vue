<template class='commentTile'>
  <div class='comment tile'>
    <div>
      <div>{{ comment.details.content }}</div>
      <div class='commentAuthor'>
        <img v-bind:src='comment.author.picture'/>
        <span>{{comment.author.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      default() {
        return {  }
      }
    }
  },
  methods: {
  },
  ready() {

  }
 }
</script>
