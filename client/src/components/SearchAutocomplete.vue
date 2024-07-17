<template>
    <div class="autocomplete">
      <input
        type="text"
        @input="onChange"
        v-model="search"
        @keydown.down="onArrowDown"
        @keydown.up="onArrowUp"
        @keydown.enter="onEnter"
      />
      <ul
        id="autocomplete-results"
        v-show="isOpen"
        class="autocomplete-results"
      >
        <li
          class="loading"
          v-if="isLoading"
        >
          Loading results...
        </li>
        <li
          v-else
          v-for="(result, i) in results"
          :key="i"
          @click="setResult(result)"
          class="autocomplete-result"
          :class="{ 'is-active': i === arrowCounter }"
        >
          {{ result.name }} - {{ result.id }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
    export default {
      name: 'SearchAutocomplete',
      props: {
        items: {
          type: Array,
          required: false,
          default: () => [],
        },
        isAsync: {
          type: Boolean,
          required: false,
          default: false,
        },
        parent: {
          type: Object,
          required: false,
          default: false,
        },
      },
      data() {
        return {
          isOpen: false,
          results: [],
          search: '',
          isLoading: false,
          arrowCounter: -1,
        };
      },
      watch: {
        items: function (value, oldValue) {
          if (value.length !== oldValue.length) {
            this.results = value;
            this.isLoading = false;
          }
        },
      },
      mounted() {
        document.addEventListener('click', this.handleClickOutside)
      },
      destroyed() {
        document.removeEventListener('click', this.handleClickOutside)
      },
      methods: {
        setResult(result) {
          console.log('result ', result)
          this.search = result.name;
          this.isOpen = false;
          this.$emit('clicked', result)
        },
        filterResults() {
          this.results = this.items.filter((item) => {
            return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
          });
        },
        onChange() {
          this.$emit('input', this.search);
  
          if (this.isAsync) {
            this.isLoading = true;
          } else {
            this.filterResults();
            this.isOpen = true;
          }
        },
        handleClickOutside(event) {
          if (!this.$el.contains(event.target)) {
            this.isOpen = false;
            this.arrowCounter = -1;
          }
        },
        onArrowDown() {
          if (this.arrowCounter < this.results.length) {
            this.arrowCounter = this.arrowCounter + 1;
          }
        },
        onArrowUp() {
          if (this.arrowCounter > 0) {
            this.arrowCounter = this.arrowCounter - 1;
          }
        },
        onEnter() {
          let result = this.results[this.arrowCounter]
          this.search = result.name;
          this.isOpen = false;
          this.arrowCounter = -1;
          this.$emit('clicked', result)
        },
      },
    };
  </script>
  
  <style>
    .autocomplete {
      position: relative;
    }
  
    .autocomplete-results {
      position: absolute;
      top: 40px;
      left: 0;
      width: 100%;
      padding: 0;
      margin: 0;
      border: 1px solid #eeeeee;
      background: #fff;
      height: 300px;
      overflow: auto;
    }
  
    .autocomplete-result {
      list-style: none;
      text-align: left;
      padding: 4px 10px;
      cursor: pointer;
    }
  
    .autocomplete-result.is-active,
    .autocomplete-result:hover {
      background-color: #282828;
      color: white;
    }

    .v-card, .v-card-title {
        overflow: visible!important;;
    }

  </style>