import { supabase } from "../utils/supabase";
import { decode } from "base64-arraybuffer";

export const uploadToSupabase = async (uri: any) => {
  try {
    const filename = uri.split("/").pop();
    const { data, error } = await supabase.storage
      .from("PostImages") // Replace with your storage bucket name
      .upload(`images/${filename}`, decode("base64FileData"), {
        contentType: "image/png",
      });
    console.log(data);

    if (error) throw error;

    // Generate a public URL
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(`images/${filename}`);
    return publicUrlData.publicUrl; // Return the Supabase file URL
  } catch (error) {
    console.error("Error uploading image to Supabase:", error);
    throw error;
  }
};
