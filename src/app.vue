<template>
  <div class="widgetWrapper">
    <div class='currentImageWrapper'>
      <img src="{{entry.images.square}}" ng-if="{{entry != null}}" v-show="!isTransitioning" transition='fade'/>
      <div class='currentImageDescription' v-show="!isTransitioning" transition='fade'>
        {{entry.details.html_description}}
      </div>
      <div class='currentImageTitle' v-show="!isTransitioning" transition='fade'>
        {{entry.details.name}}
      </div>
    </div>
    <div class='rightTiles'>
      <div class='authorInformation tile' >
        <img src="{{entry.author.picture}}" />
        <span>{{entry.author.name}}</span>
        <span>Posted to {{entry.source.network}} {{entry.details.age}}
      </div>
      <div class='comment tile'>{{comments[0].details.content}}</div>
      <div class='comment tile'>Another Comment!</div>
      <div class='comment tile'>Hey!</div>
      <div class='previewImage tile'><img src="{{entries[this.count+1].images.square}}"></div>
      <div class='previewImage tile'><img src="{{entries[this.count+2].images.square}}"></div>
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
export default {
  data () {
     return {
       count: 1,
       pageCount: 1,
       entries: [],
       entry: {},
       isTransitioning: false
     }
   },
   methods: {
     increment () {
       this.count ++;
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
      this.count += 1;
      console.log('current entry: ' + this.count)
      console.log('current entries: ' + this.entries.length)
      this.entry = this.entries[this.count];
      this.loadComment();
      setTimeout(this.startTransition, 3000);
      if (this.count >= (this.entries.length - 2 )) {
        console.log('get more entries')
        this.getEntries();
      }
    },
    startTransition() {
      console.log('startTransition');
      this.isTransitioning = true;
      setTimeout(this.endTransition, 2000);
    },
    endTransition() {
      console.log('endTransition');
      this.isTransitioning = false;
    }
   },
   ready() {
     this.getEntries()

     this.ifTransitioning = false;
     setInterval(this.nextEntry, 5000);
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
}

.currentImageWrapper img {
  width: 100%;
}

.currentImageWrapper, .rightTiles {
  display: inline-block;
}

.currentImageDescription {
  position: absolute;
  top: 100px;
  left: 150px;
  font-size: 20px;
  font-style: italic;
}
.currentImageTitle {
  font-size: 33px;
  position: absolute;
  top: 50px;
  left: 50px;
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
.authorInformation img{
  width: 100px
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

.tile.previewImage img{
  width: 100%
}

.fade-transition {
  transition: opacity .3s ease;
  opacity: 1;
}

.fade-enter, .fade-leave {
  opacity: 0
}
</style>
