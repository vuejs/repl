import { Component } from "vue";

interface EditorProps {
    value: string;
    filename: string;
    readonly?: boolean
}

interface EditorEmits {
    (e: 'change', code: string): void
}

export type EditorComponentType = Component<EditorProps, EditorEmits> & {
    editorType: 'monaco' | 'codemirror'
};
