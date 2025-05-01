import { supabase } from "../utils/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { compressImages } from "../utils/ImageCompression";

export const uploadToSupabase = async (uris: string[]) => {
  const publicUrlArray: string[] = [];
  try {
    // Compress images before uploading
    const compressedUris = await compressImages(uris);
    
    await Promise.all(
      compressedUris.map(async (uri) => {
    //for (const uri of uris) {

      const filename = uri.split("/").pop();
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      const { data, error } = await supabase.storage
        .from("PostImages") // Replace with your storage bucket name
        .upload(`images/${filename}`, decode(base64), {
          contentType: "image/*",
        });

      if (error) throw error;
      // Generate a public URL
      const { data: publicUrlData } = supabase.storage
        .from("PostImages")
        .getPublicUrl(`images/${filename}`);
      publicUrlArray.push(publicUrlData.publicUrl);

      if (error) throw error;
    }))
   // merge all the urls into single string
    const combinedUrls = JSON.stringify(publicUrlArray);
    return combinedUrls;
  } catch (error) {
    console.error("Error uploading image to Supabase:", error);
    throw error;
  }
};
