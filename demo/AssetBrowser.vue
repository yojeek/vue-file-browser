<script lang="ts">
import {defineComponent, ref} from 'vue';
import {FileBrowser} from "../lib";
import type {FileBrowserDirectory, FileBrowserFile} from "../lib/types";
import {
  openDirectory,
  verifyDirectoryPermission,
  getFileFromCache,
  saveFileToCache,
  listingToDirectoryRecursive,
  getHandleFromCache,
  saveHandleToCache
} from "./file-system-access";
import type {FileSystemDirectoryHandle} from './file-system-access';

export default defineComponent({
  name: 'AssetBrowser',
  components: {
    FileBrowser
  },
  setup() {
    const rootDirectory = ref<FileBrowserDirectory | null>(null);
    const fileContent = ref<string | null>(null);

    async function getStoredRoot() {
      rootDirectory.value = null;
      const rootDirectoryFromStorage = await getHandleFromCache('rootDirectory') as FileSystemDirectoryHandle;

      if (rootDirectoryFromStorage) {
        await verifyDirectoryPermission(rootDirectoryFromStorage, true);

        rootDirectory.value = await listingToDirectoryRecursive(rootDirectoryFromStorage);
      } else {
        alert('no root directory stored')
      }
    }

    async function onOpenDirectory() {
      rootDirectory.value = null;
      const dirHandle = await openDirectory()

      await saveHandleToCache('rootDirectory', dirHandle);
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

    async function selectFile(file: FileBrowserFile) {
      let fileBlob = await file.handle.getFile();
      await saveHandleToCache('fileHandle', file.handle);
      await saveFileToCache('file', fileBlob);
      fileContent.value = (await fileBlob.text()).slice(0, 100);
    }

    async function getStoredFile() {
      const fileHandle = await getHandleFromCache('fileHandle') as FileSystemFileHandle;

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

    getStoredRoot().catch(e => console.warn(e));

    return {
      rootDirectory,
      fileContent,
      onOpenDirectory,
      getStoredFileFromCache,
      selectFile,
      getStoredFile,
      changeDirectory,
      getStoredRoot
    }
  }
});
</script>

<template>
  <div class="asset-browser">
    <h3>vue-file-browser with File System API demo</h3>
    <div>
      Gain access to file system, list files and store the directory handle in cache: <br>
      <button @click="onOpenDirectory">Open Directory</button>
    </div>
    <div>
      Get the stored directory handle from cache and list the files: <br>
      <button @click="getStoredRoot">Get Stored Directory</button>
    </div>
    <div>
      Get the stored file handle from cache and display it's content: <br>
      <button @click="getStoredFile">Get Stored File</button>
    </div>
    <div>
      Get the stored file from cache and display content: <br>
      <button @click="getStoredFileFromCache">Get Stored File from Cache</button>
    </div>

    <div style="display: flex">
      <div style="flex: 1">
        <h3>Directory Listing</h3>
        <FileBrowser v-if="rootDirectory"
                     @select-file="selectFile"
                     @change-directory="changeDirectory"
                     :rootDirectory="rootDirectory"
        />
      </div>
      <div style="flex: 1">
        <h3>File Content</h3>
        <pre v-if="fileContent">{{ fileContent }}</pre>
      </div>
    </div>
  </div>
</template>

<style>
</style>
