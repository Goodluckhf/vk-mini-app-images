export interface FolderInterface {
    name: string;
    path: string;
    photos: FolderPhotoInterface[];
}

export interface FolderPhotoInterface {
    name: string;
}