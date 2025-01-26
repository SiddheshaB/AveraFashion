import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import React from "react";
import { FlatList, Text, View, Image, Dimensions } from "react-native";
import Swiper from "react-native-swiper";
console.log("On uploaded posts");
export default function DisplayAllPosts() {
  const [postdata, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tableData, error } = await supabase
          .from("posts")
          .select("*");
        setData(tableData);
      } catch (error) {
        console.error("Error retrieving data from Supabase:", error);
        throw error;
      }
    };
    fetchData();
  }, []);

  return (
    <FlatList
      data={postdata}
      renderItem={({ item }) => (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>{item.title}</Text>
          <Swiper
            style={{ height: 300 }}
            loop={false}
            dotStyle={{
              backgroundColor: "white",
              width: 8,
              height: 8,
              borderRadius: 4,
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 3,
            }}
            activeDotColor="black"
          >
            {JSON.parse(item.image_url).map((uri, index) => (
              <View key={index}>
                <Image
                  source={{ uri }}
                  style={{ width: 300, height: 300 }}
                ></Image>
              </View>
            ))}
          </Swiper>
          <Text>{item.content}</Text>
        </View>
      )}
      style={{
        flex: 1,
        backgroundColor: "white",
        padding: 50,
      }}
      keyExtractor={(item) => item.post_id}
      contentContainerStyle={{
        justifyContent: "center",
        gap: 20,
      }}
    ></FlatList>
  );
}
