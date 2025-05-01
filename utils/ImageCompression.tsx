import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

// Define a more specific type for file info that includes size
interface FileInfoWithSize {
  exists: boolean;
  uri: string;
  isDirectory: boolean;
  size?: number;
  modificationTime?: number;
}

/**
 * Compresses an image if it exceeds the specified size limit
 * @param uri - URI of the image to compress
 * @param maxSizeInMB - Maximum size in MB (default: 3)
 * @param quality - Initial compression quality (default: 0.8)
 * @returns Promise with the URI of the compressed image
 */
export const compressImage = async (
  uri: string,
  maxSizeInMB: number = 3,
  quality: number = 0.8
): Promise<string> => {
  try {
    // Get file info to check size
    const fileInfo = await FileSystem.getInfoAsync(uri, { size: true }) as FileInfoWithSize;
    
    // Convert maxSizeInMB to bytes for comparison
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    // If file size is already under the limit, return the original URI
    if (!fileInfo.exists || !fileInfo.size || fileInfo.size <= maxSizeInBytes) {
      console.log('Image already under size limit, no compression needed');
      return uri;
    }
    
    console.log(`Original image size: ${(fileInfo.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Calculate appropriate quality based on how much we need to reduce the size
    // The more we need to reduce, the lower the quality
    let compressionQuality = quality;
    if (fileInfo.size > maxSizeInBytes * 2) {
      // If file is more than twice the limit, use a lower quality
      compressionQuality = 0.6;
    }
    if (fileInfo.size > maxSizeInBytes * 4) {
      // If file is more than 4 times the limit, use an even lower quality
      compressionQuality = 0.4;
    }
    if (fileInfo.size > maxSizeInBytes * 8) {
      // If file is more than 8 times the limit, use an even lower quality
      compressionQuality = 0.2;
    }
    
    // Compress the image
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [], // No transformations, just compression
      { compress: compressionQuality, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    // Check if the compressed image is now under the size limit
    const compressedFileInfo = await FileSystem.getInfoAsync(result.uri, { size: true }) as FileInfoWithSize;
    
    // Log the compressed size
    console.log(`Compressed image size: ${
      compressedFileInfo.size ? (compressedFileInfo.size / 1024 / 1024).toFixed(2) : 'unknown'
    } MB`);
    
    // Return the compressed image URI even if it's still over the limit
    // We've done our best to compress it with the lowest reasonable quality
    return result.uri;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original URI if compression fails
    return uri;
  }
};

/**
 * Compresses multiple images if they exceed the specified size limit
 * @param uris - Array of image URIs to compress
 * @param maxSizeInMB - Maximum size in MB (default: 3)
 * @returns Promise with an array of compressed image URIs
 */
export const compressImages = async (
  uris: string[],
  maxSizeInMB: number = 3
): Promise<string[]> => {
  try {
    const compressedUris = await Promise.all(
      uris.map(uri => compressImage(uri, maxSizeInMB))
    );
    return compressedUris;
  } catch (error) {
    console.error('Error compressing images:', error);
    // Return original URIs if compression fails
    return uris;
  }
};
