import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import React from "react";
import { FlatList, Text, View } from "react-native";
console.log("On uploaded posts");
export default async function uploadedPosts() {
  const myPostData = [];
  try {
    console.log("Inside try block");
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", (await supabase.auth.getSession()).data.session.user.id);
    myPostData.push(data);
    console.log("Retrived data:", myPostData);
  } catch (error) {
    console.error("Error retrieving data from Supabase:", error);
    throw error;
  }

  return (
    <Text>hello</Text>
    /* <FlatList
      data={myPostData}
      renderItem={({ item }) => (
        <View style={{ backgroundColor: "grey" }}>
          <Text>{item.title}</Text>
          <Text>{item.content}</Text>
          <Text>{item.title}</Text>
        </View>
      )}
      keyExtractor={(item) => item.post_id}
    ></FlatList>
  ); */
  );
}
