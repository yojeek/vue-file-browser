<script setup lang="ts">
// @ts-ignore
import {showDirectoryPicker, FileSystemDirectoryHandle} from 'native-file-system-adapter'
import {ref} from "vue";
import FileBrowser from "../lib/FileBrowser.vue";
import type {Directory} from "../lib";
import * as idb from 'idb-keyval';

async function verifyPermission(fileHandle, readWrite) {
  const options = {};

  if (readWrite) {
    options.mode = 'readwrite';
  }

  // Check if permission was already granted. If so, return true.
  if ((await fileHandle.queryPermission(options)) === 'granted') {
    return true;
  }
  // Request permission. If the user grants permission, return true.
  if ((await fileHandle.requestPermission(options)) === 'granted') {
    return true;
  }
  // The user didn't grant permission, so return false.
  return false;
}

const rootDirectory = ref<Directory | null>(null);
const rootDirectoryFromStorage = await idb.get<Directory>('rootDirectory');

if (rootDirectoryFromStorage) {
  await verifyPermission(rootDirectoryFromStorage, true);

  rootDirectory.value = await listingToDirectoryRecursive(rootDirectoryFromStorage);
}

async function onOpenDirectory() {
  rootDirectory.value = null;
  const dirHandle = await showDirectoryPicker()

  await idb.set('rootDirectory', dirHandle);
  rootDirectory.value = await listingToDirectoryRecursive(dirHandle);

  console.log(rootDirectory.value)
}

async function listingToDirectoryRecursive(blob: FileSystemDirectoryHandle): Promise<Directory> {
  const result: Directory = {
    name: blob.name,
    files: [],
    directories: []
  };

  for await (const entry of blob.values()) {
    if (entry.kind === 'directory') {
      result.directories.push(await listingToDirectoryRecursive(entry as unknown as FileSystemDirectoryHandle));
    } else {
      result.files.push({
        name: entry.name,
        handle: entry as unknown as FileSystemFileHandle
      });
    }
  }

  return result
}

function selectFile(file: File) {
  console.log('selectFile', file)
}

function changeDirectory(directory: Directory) {
  console.log('changeDirectory', directory)
}

</script>

<template>
  <button @click="onOpenDirectory">Open Directory</button>
  <FileBrowser v-if="rootDirectory"
               @select-file="selectFile"
               @change-directory="changeDirectory"
               :rootDirectory="rootDirectory"
  />
</template>

<style scoped>

</style>
