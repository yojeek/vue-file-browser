<script setup lang="ts">
import {ref} from 'vue'
import {get, set} from 'idb-keyval';
import * as browserFs from 'browser-fs-access';
import type {FileWithDirectoryAndFileHandle} from "browser-fs-access";

const browserFsSupported = ref(browserFs.supported);
const directoryListing = ref([]);

async function onOpenDirectory() {
  const blobs = await browserFs.directoryOpen({
    recursive: true,
    mode: 'read',
    /*startIn: "documents"*/
  });

  directoryListing.value = blobs;
}

type Directory = {
  files: string[];
  directories: Set<string>;
}

function listingToDirectory(blobs: FileWithDirectoryAndFileHandle[] | FileSystemDirectoryHandle[]): Directory {
  const files: File[] = [];
  const directories = new Set<string>();

  for (const blob of blobs) {
    if ('directoryHandle' in blob && blob.directoryHandle) {
      directories.add(blob.directoryHandle.name);
    }

    if ('webkitRelativePath' in blob && blob.webkitRelativePath) {
      files.push(blob.webkitRelativePath);
    } else {
      files.push(blob.name);
    }
  }

  return {
    files,
    directories
  }
}

</script>

<template>
  <div v-if="browserFsSupported">
    <!-- Content to show when browserFsSupported is true -->
    <p>Using the File System Access API.</p>
  </div>
  <div v-else>
    <!-- Content to show when browserFsSupported is false -->
    <p>Using the fallback implementation.</p>
  </div>
  <hr/>
  <button @click="onOpenDirectory">Open Directory</button>
  <pre>
    <span v-for="blob in directoryListing" :key="blob.name">
      {{ blob.webkitRelativePath || blob.name }}
    </span>
  </pre>
  <pre>
    {{ listingToDirectory(directoryListing) }}
  </pre>
</template>

<style scoped>
</style>
