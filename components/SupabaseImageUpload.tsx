import { supabase } from "../utils/supabase";
import { decode } from "base64-arraybuffer";

export const uploadToSupabase = async (uris: any) => {
  const publicUrlArray = [];
  try {
    console.log("Uri received in uploadTo Supabase", uris);
    for (const uri of uris) {
      const filename = uri.split("/").pop();
      const { data, error } = await supabase.storage
        .from("PostImages") // Replace with your storage bucket name
        .upload(`images/${filename}`, decode("base64FileData"), {
          contentType: "image/png",
        });
      console.log(data);
      // Generate a public URL
      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(`images/${filename}`);
      publicUrlArray.push(publicUrlData.publicUrl);
      console.log("Return URL: ", publicUrlArray);
      if (error) throw error;
    }
    const combinedUrls = publicUrlArray.join(","); // merge all the urls into single string
    console.log("Combined URL link: ", combinedUrls);
    return combinedUrls;
  } catch (error) {
    console.error("Error uploading image to Supabase:", error);
    throw error;
  }
};
