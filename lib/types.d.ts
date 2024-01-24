export type FileBrowserFile = { name: string, handle?: any };

export type FileBrowserDirectory = {
    name: string;
    files: FileBrowserFile[];
    directories: FileBrowserDirectory[];
}
