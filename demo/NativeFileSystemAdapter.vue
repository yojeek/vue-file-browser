<script setup lang="ts">
// @ts-ignore
import {showDirectoryPicker, FileSystemDirectoryHandle, FileSystemHandle} from 'native-file-system-adapter'
import {ref} from "vue";
import FileBrowser from "../lib/FileBrowser.vue";
import type {Directory} from "../lib";
import * as idb from 'idb-keyval';
import {verifyPermission} from "./helpers.ts";

const rootDirectory = ref<Directory | null>(null);

async function getStoredRoot() {
  rootDirectory.value = null;
  const rootDirectoryFromStorage = await idb.get<FileSystemDirectoryHandle>('rootDirectory');

  if (rootDirectoryFromStorage) {
    await verifyPermission(rootDirectoryFromStorage, true);

    rootDirectory.value = await listingToDirectoryRecursive(rootDirectoryFromStorage);
  } else {
    alert('no root directory stored')
  }
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


const fileContent = ref<string | null>(null);

const storedFile = await idb.get<File>('file');

if (storedFile) {
  fileContent.value = (await storedFile.text()).slice(0, 100);
}

async function selectFile(file: FileSystemHandle) {
  console.log('selectFile', file)
  let fileBlob = await file.handle.getFile();
  idb.set('file', fileBlob);
  fileContent.value = (await fileBlob.text()).slice(0, 100);
}

function changeDirectory(directory: Directory) {
  console.log('changeDirectory', directory)
}

</script>

<template>
  <button @click="onOpenDirectory">Open Directory</button>
  <button @click="getStoredRoot">Get Stored Directory</button>
  <FileBrowser v-if="rootDirectory"
               @select-file="selectFile"
               @change-directory="changeDirectory"
               :rootDirectory="rootDirectory"
  />
  <p>Stored File Content</p>
  <pre v-if="fileContent">{{ fileContent }}</pre>
</template>

<style scoped>

</style>
