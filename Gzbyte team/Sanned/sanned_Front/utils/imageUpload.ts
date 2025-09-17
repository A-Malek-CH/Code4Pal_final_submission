// Local image handling utility for development
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  id?: string;
  error?: string;
}

export interface UploadOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Pick image from device gallery
 */
export const pickImage = async (options: ImagePicker.ImagePickerOptions = {}): Promise<ImagePicker.ImagePickerResult> => {
  // Request permission
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (permissionResult.granted === false) {
    Alert.alert('Permission Required', 'Permission to access camera roll is required to upload images.');
    return { canceled: true, assets: null };
  }

  const defaultOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.8,
    ...options
  };

  return await ImagePicker.launchImageLibraryAsync(defaultOptions);
};

/**
 * Take photo with camera
 */
export const takePhoto = async (options: ImagePicker.ImagePickerOptions = {}): Promise<ImagePicker.ImagePickerResult> => {
  // Request permission
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
  if (permissionResult.granted === false) {
    Alert.alert('Permission Required', 'Permission to access camera is required to take photos.');
    return { canceled: true, assets: null };
  }

  const defaultOptions: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.8,
    ...options
  };

  return await ImagePicker.launchCameraAsync(defaultOptions);
};

/**
 * Save image locally to app's document directory
 */
export const saveImageLocally = async (
  imageUri: string, 
  options: UploadOptions = {}
): Promise<ImageUploadResult> => {
  try {
    console.log('Saving image locally:', imageUri);

    // Generate a unique ID for the image
    const imageId = `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get file extension
    const filename = imageUri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const extension = match ? match[1] : 'jpg';
    
    // Create new filename with unique ID
    const newFilename = `${imageId}.${extension}`;
    
    // Define the destination path in the app's document directory
    const destinationPath = `${FileSystem.documentDirectory}images/${newFilename}`;
    
    // Create images directory if it doesn't exist
    const imagesDir = `${FileSystem.documentDirectory}images/`;
    const dirInfo = await FileSystem.getInfoAsync(imagesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });
    }
    
    // Copy the image to our local directory
    await FileSystem.copyAsync({
      from: imageUri,
      to: destinationPath
    });
    
    console.log('Image saved locally:', destinationPath);
    
    return {
      success: true,
      url: destinationPath,
      id: imageId,
    };
  } catch (error) {
    console.error('Error saving image locally:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save image locally',
    };
  }
};

/**
 * Utility function to handle complete image selection and local save flow
 */
export const selectAndUploadImage = async (
  source: 'gallery' | 'camera' = 'gallery',
  uploadOptions: UploadOptions = {}
): Promise<ImageUploadResult> => {
  try {
    // Pick/take image
    const result = source === 'camera' 
      ? await takePhoto()
      : await pickImage();

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, error: 'Image selection cancelled' };
    }

    const imageUri = result.assets[0].uri;
    
    // Save locally instead of uploading to Cloudflare
    return await saveImageLocally(imageUri, uploadOptions);
  } catch (error) {
    console.error('Error in selectAndUploadImage:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to select and save image',
    };
  }
};

/**
 * Delete image from local storage
 */
export const deleteImageLocally = async (imageId: string): Promise<boolean> => {
  try {
    // Try common extensions
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    for (const ext of extensions) {
      const imagePath = `${FileSystem.documentDirectory}images/${imageId}.${ext}`;
      const fileInfo = await FileSystem.getInfoAsync(imagePath);
      
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(imagePath);
        console.log('Image deleted successfully:', imagePath);
        return true;
      }
    }
    
    console.log('Image not found for deletion:', imageId);
    return false;
  } catch (error) {
    console.error('Error deleting image locally:', error);
    return false;
  }
};

/**
 * Get local image URL (for development - no transformations available locally)
 */
export const getLocalImageUrl = (imageId: string, extension: string = 'jpg'): string => {
  return `${FileSystem.documentDirectory}images/${imageId}.${extension}`;
};

/**
 * List all locally stored images
 */
export const listLocalImages = async (): Promise<string[]> => {
  try {
    const imagesDir = `${FileSystem.documentDirectory}images/`;
    const dirInfo = await FileSystem.getInfoAsync(imagesDir);
    
    if (!dirInfo.exists) {
      return [];
    }
    
    const files = await FileSystem.readDirectoryAsync(imagesDir);
    return files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
  } catch (error) {
    console.error('Error listing local images:', error);
    return [];
  }
};