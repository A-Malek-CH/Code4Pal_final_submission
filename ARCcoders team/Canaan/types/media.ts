export interface Media {
  id: string;
  name: string;
  createdAt: Date;
  key: string;
  url: string;
  size: string;
  type: string;
}
export interface EditableImage extends MediaCreation {
  file: File;
  edited?: boolean;
  editedBlob?: Blob;
}

export interface ImageEditState {
  zoom: number;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}
export interface MediaCreation
  extends Omit<Media, "id" | "createdAt" | "type"> {}
