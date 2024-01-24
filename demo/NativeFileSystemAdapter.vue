<script setup lang="ts">
// @ts-ignore
import {showDirectoryPicker} from 'native-file-system-adapter';
// @ts-ignore
import type {FileSystemDirectoryHandle, FileSystemHandle} from 'native-file-system-adapter';
import {ref} from "vue";
import FileBrowser from "../lib/FileBrowser.vue";
import type {FileBrowserDirectory, FileBrowserFile} from "../lib/types";
import * as idb from 'idb-keyval';
import {verifyDirectoryPermission, getFileFromCache, saveFileToCache, listingToDirectoryRecursive} from "./helpers.ts";

const rootDirectory = ref<FileBrowserDirectory | null>(null);

async function getStoredRoot() {
  rootDirectory.value = null;
  const rootDirectoryFromStorage = await idb.get('rootDirectory') as FileSystemDirectoryHandle;

  if (rootDirectoryFromStorage) {
    await verifyDirectoryPermission(rootDirectoryFromStorage, true);

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

async function getStoredFileFromCache() {
  const storedFile = await getFileFromCache('file');

  if (storedFile) {
    fileContent.value = (await storedFile.text()).slice(0, 100);
  } else {
    alert('no file stored')
  }
}

const fileContent = ref<string | null>(null);

async function selectFile(file: FileBrowserFile) {
  let fileBlob = await file.handle.getFile();
  await idb.set('fileHandle', file.handle);
  await saveFileToCache('file', fileBlob);
  fileContent.value = (await fileBlob.text()).slice(0, 100);
}

async function getStoredFile() {
  const fileHandle = await idb.get('fileHandle') as FileSystemFileHandle;

  if (fileHandle) {
    await getStoredRoot();
    try {
      const fileBlob = await fileHandle.getFile();
      fileContent.value = (await fileBlob.text()).slice(0, 100);
    } catch (e: unknown) {
      alert(`cant get file ${e} ${JSON.stringify(e)}`)
    }
  } else {
    alert('no file stored')
  }
}

function changeDirectory(directory: FileBrowserDirectory) {
  console.log('changeDirectory', directory)
}
</script>

<template>
  <button @click="onOpenDirectory">Open Directory</button>
  <button @click="getStoredRoot">Get Stored Directory</button>
  <button @click="getStoredFile">Get Stored File</button>
  <button @click="getStoredFileFromCache">Get Stored File From Cache</button>
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
