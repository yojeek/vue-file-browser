<script lang="ts">
import {ref} from 'vue';
import type {FileBrowserDirectory, FileBrowserFile} from "./types";
import {defineComponent, PropType} from "vue";

export default defineComponent({
  name: 'FileBrowser',
  props: {
    rootDirectory: {
      type: Object as PropType<FileBrowserDirectory>,
      required: true
    }
  },
  setup(props, {emit}) {
    const selectedFile = ref<FileBrowserFile | null>(null);
    const currentDirectory = ref<FileBrowserDirectory>(props.rootDirectory);

    const directoriesStack: FileBrowserDirectory[] = [];

    function selectFile(file: FileBrowserFile) {
      selectedFile.value = file;
      emit('select-file', file);
    }

    function changeDirectory(directory: FileBrowserDirectory) {
      directoriesStack.push(currentDirectory.value);
      currentDirectory.value = directory;
      emit('change-directory', directory);
    }

    function goUp() {
      if (directoriesStack.length > 0) {
        currentDirectory.value = directoriesStack.pop() as FileBrowserDirectory;
      }
    }

    return {
      selectedFile,
      currentDirectory,
      goUp,
      selectFile,
      changeDirectory
    }
  },
  emits: ['select-file', 'change-directory']
})
</script>

<template>
  <div class="file-browser-wrapper">
    <div v-if="currentDirectory">
      <h2>{{ currentDirectory.name }}</h2>
      <ul class="file-browser-list">
        <li v-if="currentDirectory !== rootDirectory" class="directory up">
          <button @click="goUp">..</button>
        </li>
        <li v-for="directory in currentDirectory.directories" :key="directory.name" class="directory">
          <button @click="changeDirectory(directory)">{{ directory.name }}</button>
        </li>
        <li v-for="file in currentDirectory.files" :key="file.name" :class="{ 'file-selected': selectedFile === file, 'file': true }">
          <button @click="selectFile(file)">{{ file.name }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
  .file-browser-list {
    list-style: none;
    padding: 0;
  }
  .file-selected button{
    background-color: #ccc;
  }
  .directory button {
    background-color: #eee;
  }
</style>
