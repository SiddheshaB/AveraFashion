import { supabase } from "../utils/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
export const uploadToSupabase = async (uris: any) => {
  const publicUrlArray = [];
  try {
    console.log("Uri received in uploadTo Supabase", uris);

    for (const uri of uris) {
      //console.log("")
      const filename = uri.split("/").pop();
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      console.log("filename:", filename);
      const { data, error } = await supabase.storage
        .from("PostImages") // Replace with your storage bucket name
        .upload(`images/${filename}`, decode(base64), {
          contentType: "image/*",
        });
      console.log("Post data uploaded ", data);
      // Generate a public URL
      const { data: publicUrlData } = supabase.storage
        .from("PostImages")
        .getPublicUrl(`images/${filename}`);
      publicUrlArray.push(publicUrlData.publicUrl);
      console.log("Return URL: ", publicUrlArray);
      if (error) throw error;
    }
    //const combinedUrls = publicUrlArray.join(","); // merge all the urls into single string
    const combinedUrls = JSON.stringify(publicUrlArray);
    console.log("Combined URL link: ", combinedUrls);
    return combinedUrls;
  } catch (error) {
    console.error("Error uploading image to Supabase:", error);
    throw error;
  }
};
