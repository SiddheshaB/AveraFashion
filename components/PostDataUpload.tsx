import { supabase } from "../utils/supabase";

export const postDataUpload = async (
  title: any,
  content: any,
  supabaseUrl: any,
  occasion: string
) => {
  try {
    const { data, error } = await supabase
      .from("posts") // Replace with your storage bucket name
      .insert({
        title: title,
        image_url: supabaseUrl,
        user_id: (await supabase.auth.getSession()).data.session.user.id,
        content: content,
        occasion: occasion,
      });
    console.log(data);

    if (error) throw error;
  } catch (error) {
    console.error("Error uploading data to Supabase table:", error);
    throw error;
  }
};
