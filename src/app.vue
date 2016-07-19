<template>
  <div class="widgetWrapper" v-if="this.entries.length > 0 && this.site != null">
    <div class='currentImageWrapper'>
      <img v-bind:src="entry.images.square" v-show="!isTransitioning" transition='fade'/>
      <div class='currentImageDescription' v-show="!isTransitioning" transition='fade'>
        {{entry.details.description}}
      </div>
      <div class='currentImageTitle' v-show="!isTransitioning" transition='fade'>
        {{entry.details.name}}
      </div>
    </div>
    <div class='rightTiles'>
      <div class='authorInformation tile' >
        <img v-bind:src="entry.author.picture" />
        <div class='authorName'>
          <span>{{entry.author.name}}</span>
        </div>
      </div>
      <div class='networkInformation tile'>
        <img v-bind:src='getPostedServiceImage(entry)' />
        <span>Posted to {{ site.details.name }} {{ entry.details.age }} ago</span>
      </div>
      <comment-tile :comment="comments[0]"></comment-tile>
      <comment-tile :comment="comments[1]"></comment-tile>
      <div class='previewImage tile'><img v-bind:src="entries[this.count+1].images.square"></div>
      <div class='previewImage tile'><img v-bind:src="entries[this.count+2].images.square"></div>
    </div>
    <div class='fixedFooter'>
      <div class='tagsWrapper'>
        <ul>
          <li>#sun</li>
          <li>#beach</li>
          <li>#summer</li>
          <li>#weekend</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import CommentTile from './commenttile.vue'

export default {
  components: { CommentTile },
  data () {
     return {
       count: 3,
       pageCount: 1,
       entries: [],
       comments: [{details: {content: 'test'}}],
       entry: {},
       isTransitioning: false,
       site: null
     }
   },
   methods: {
     increment () {
       this.count ++;
     },
     getSite() {
       this.$http.get('https://api.shuttlerock.com/v2/news/site.json').then((response) => {
           this.site = response.data;
       }, (response) => {
           console.error('Something went wrong!!');
       });
     },
     getEntries() {
        // GET /someUrl
        this.$http.get('https://api.shuttlerock.com/v2/news/entries.json?page=' + this.pageCount).then((response) => {
            this.entries = this.entries.concat(response.data);
            this.entry = this.entries[this.count];
            this.pageCount++;
            this.loadComment();
        }, (response) => {
            console.error('Something went wrong!!');
        });
     },
    loadComment() {
      this.$http.get('https://api.shuttlerock.com/v2/news/entries/' + this.entry.id + '/comments.json').then((response) => {
          this.comments = response.data
      }, (response) => {
          console.error('Something went wrong!!')
      });
    },
    nextEntry() {
      this.startTransition();
      setTimeout(this.setNextEntry, 250);
      setTimeout(this.nextEntry, 5000);
    },
    setNextEntry() {
      this.count += 1;
      console.log('current entry: ' + this.count)
      console.log('current entries: ' + this.entries.length)
      this.loadComment();
      this.entry = this.entries[this.count];
      if (this.count >= (this.entries.length - 2 )) {
        console.log('get more entries')
        this.getEntries();
      }
    },
    getPostedServiceImage(entry) {
      switch(entry.source.network) {
        case 'shuttlerock':
          return this.site.images.square
          break;
        default:
          //TODO: Add Images for other networks
          break;
      }
    },
    startTransition() {
      console.log('startTransition');
      this.isTransitioning = true;
      setTimeout(this.endTransition, 1000);
    },
    endTransition() {
      console.log('endTransition');
      this.isTransitioning = false;
    }
   },
   ready() {
     this.getSite();
     this.getEntries();

     this.nextEntry()
     this.ifTransitioning = false;

   }
}
</script>

<style>
body {
  font-family: Arial;
}

.widgetWrapper {
  height: 491px;
  width:819px;
  display: inline-block;
}

.currentImageWrapper{
  width: 60%;
  min-width: 60%;
  min-height: 100px;
  float: left;
  color: #fff;
  text-shadow: 2px 0 0 #000, -2px 0 0 #000, 0 2px 0 #000, 0 -2px 0 #000, 1px 1px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
}

.currentImageWrapper img {
  width: 100%;
}

.currentImageWrapper, .rightTiles {
  display: inline-block;

}

.currentImageDescription {
  position: absolute;
  top: 73px;
  left: 65px;
  font-size: 12px;
  width: 400px;
  font-style: italic;
}
.currentImageTitle {
  font-size: 20px;
  position: absolute;
  top: 50px;
  left: 50px;
  width: 400px;
  font-weight: 700;
}
.fixedFooter {
  position: absolute;
  bottom: 0;
}
.fixedFooter .tagsWrapper ul {
  list-style: none;
}
.fixedFooter .tagsWrapper ul li {
  display: inline-block;
  font-size: 20px;
  padding: 0 5px;
}

.tile {
  position: relative;
}

.tile img{
  width: 100%
}

.authorInformation .authorName {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0,0,0,0.5);
  height: 20px;
  color: #fff;
}

.networkInformation span {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0,0,0,0.5);
  color: white;
}

.authorInformation .authorName span {
  padding: 5px
}

.commentAuthor {
  position:absolute;
  bottom: 0;
}

.commentAuthor img {
  width: 30px;
}

.rightTiles {
  height: 100%;
  width: 40%;
  float: left;
}

.rightTiles .tile {
  width: 50%;
  height: 33%;
  float: left;
}

.fade-transition {
  transition: opacity .3s ease;
  opacity: 1;
}

.fade-enter, .fade-leave {
  opacity: 0
}
</style>
