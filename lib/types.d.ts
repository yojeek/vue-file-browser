export type File = { name: string, handle?: any };

export type Directory = {
    name: string;
    files: File[];
    directories: Directory[];
}
