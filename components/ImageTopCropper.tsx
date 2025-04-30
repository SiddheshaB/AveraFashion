import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface ImageTopCropperProps {
  uri: string;
  width: number;
  height: number;
  style?: any;
}

/**
 * ImageTopCropper Component
 * 
 * Displays images with the top portion always visible,
 * filling the width of the container while maintaining aspect ratio.
 * Any cropping happens from the bottom, not the top.
 */
const ImageTopCropper: React.FC<ImageTopCropperProps> = ({ 
  uri, 
  width, 
  height, 
  style = {}
}) => {
  // Use state to store image dimensions
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);

  // Get image dimensions when the component mounts
  useEffect(() => {
    if (uri) {
      Image.getSize(
        uri,
        (imgWidth, imgHeight) => {
          setImageDimensions({ width: imgWidth, height: imgHeight });
          setLoading(false);
        },
        () => {
          // Fallback if we can't get dimensions
          setLoading(false);
        }
      );
    }
  }, [uri]);

  // Calculate styles based on image dimensions
  const getImageStyle = () => {
    if (loading || imageDimensions.width === 0) {
      return {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
      };
    }

    // Calculate the aspect ratio
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    
    // Calculate what height the image would be at full width
    const fullWidthHeight = width / aspectRatio;
    
    // Position at the top and ensure no space at the bottom
    return {
      width: width,
      height: Math.max(fullWidthHeight, height),
      position: 'absolute',
      top: 0,
    };
  };

  return (
    <View style={[styles.container, { width, height }, style]}>
      <Image
        source={{ uri }}
        style={getImageStyle()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  }
});

export default ImageTopCropper;
