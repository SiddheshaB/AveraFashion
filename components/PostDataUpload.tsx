import React from "react";
import { supabase } from "../utils/supabase";

export const postDataUpload = async (
  title: any,
  content: any,
  supabaseUrl: any
) => {
  try {
    const { data, error } = await supabase
      .from("posts") // Replace with your storage bucket name
      .insert({
        title: title,
        image_url: supabaseUrl,
        user_id: (await supabase.auth.getSession()).data.session.user.id,
        content: content,
      });
    console.log(data);

    if (error) throw error;
    //return <></>;
  } catch (error) {
    console.error("Error uploading data to Supabase table:", error);
    throw error;
  }
};
