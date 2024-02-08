export type FileInfoPayload = {
    objectName: string;
    name: string;
    url: string;
    extension: string;
    size: number;
};

export type FileInfoInput = {
    folder: string;
    filename: string;
    // stream: ReadStream;
    mimetype: string;
    metaData?: any;
    optimizeImages?: boolean;
};