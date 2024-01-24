import {FileSystemDirectoryHandle} from "native-file-system-adapter/types/src/showDirectoryPicker";
import * as idb from 'idb-keyval';
import type {FileBrowserDirectory} from "../lib/types";

export async function getFileFromCache(filename: string, collection?: string) : Promise<File | null> {
    const key = collection ? `${collection}:${filename}` : filename;
    const file = await idb.get(key);

    if (!file) {
        return null;
    }

    if (file instanceof File) {
        return file;
    } else {
        throw new Error(`Value of key ${key} is not an instance of File`);
    }
}

export async function saveFileToCache(key: string, file: File, collection?: string) {
    await idb.set(collection ? `${collection}:${key}` : key, file);
}

export async function verifyDirectoryPermission(handle: FileSystemDirectoryHandle, readWrite: boolean) {
    const options : any = {};

    if (readWrite) {
        options.mode = 'readwrite';
    }

    // Check if permission was already granted. If so, return true.
    if ((await handle.queryPermission(options)) === 'granted') {
        return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await handle.requestPermission(options)) === 'granted') {
        return true;
    }
    // The user didn't grant permission, so return false.
    return false;
}

export async function listingToDirectoryRecursive(blob: FileSystemDirectoryHandle): Promise<FileBrowserDirectory> {
    const result: FileBrowserDirectory = {
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
