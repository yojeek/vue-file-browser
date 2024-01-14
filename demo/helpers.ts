import {FileSystemDirectoryHandle} from "native-file-system-adapter/types/src/showDirectoryPicker";

export async function verifyPermission(handle: FileSystemDirectoryHandle, readWrite: boolean) {
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

