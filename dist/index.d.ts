import { ComponentOptionsMixin } from 'vue';
import { DefineComponent } from 'vue';
import { ExtractPropTypes } from 'vue';
import { PropType } from 'vue';
import { PublicProps } from 'vue';
import { Ref } from 'vue';

export declare const FileBrowser: DefineComponent<{
    rootDirectory: {
        type: PropType<FileBrowserDirectory>;
        required: true;
    };
}, {
    selectedFile: Ref<{
        name: string;
        handle?: any;
    } | null>;
    currentDirectory: Ref<{
        name: string;
        files: {
            name: string;
            handle?: any;
        }[];
        directories: any[];
    }>;
    goUp: () => void;
    selectFile: (file: FileBrowserFile) => void;
    changeDirectory: (directory: FileBrowserDirectory) => void;
}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, ("select-file" | "change-directory")[], "select-file" | "change-directory", PublicProps, Readonly<ExtractPropTypes<{
    rootDirectory: {
        type: PropType<FileBrowserDirectory>;
        required: true;
    };
}>> & {
    "onSelect-file"?: ((...args: any[]) => any) | undefined;
    "onChange-directory"?: ((...args: any[]) => any) | undefined;
}, {}, {}>;

declare type FileBrowserDirectory = {
    name: string;
    files: FileBrowserFile[];
    directories: FileBrowserDirectory[];
}

declare type FileBrowserFile = { name: string, handle?: any };

export { }
