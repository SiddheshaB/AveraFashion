import { useEffect, useState, useCallback } from "react";
import { supabase } from "../utils/supabase";
import React from "react";
import { FlatList, Text, View, Image, TouchableOpacity, StyleSheet, Dimensions, RefreshControl } from "react-native";
import Swiper from "react-native-swiper";
import { useSelector } from "react-redux";

export default function DisplayAllPosts() {
  const [postdata, setPostData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all"); // "all" or "my"
  const user = useSelector((state: any) => state.users[0].userInfo);

  const fetchData = async () => {
    try {
      const { data: tableData, error } = await supabase
        .from("posts")
        .select("title,image_url,content,post_id,user_id")
        .order("created_at", { ascending: false });
      setPostData(tableData);
      console.log("Post data: ", tableData);
    } catch (error) {
      console.error("Error retrieving data from Supabase:", error);
      throw error;
    }
  };

  const filteredPosts = selectedFilter === "my" 
    ? postdata.filter(post => post.user_id === user.user.id)
    : postdata;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === "all" && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter("all")}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilter === "all" && styles.filterButtonTextActive
          ]}>All Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            selectedFilter === "my" && styles.filterButtonActive
          ]}
          onPress={() => setSelectedFilter("my")}
        >
          <Text style={[
            styles.filterButtonText,
            selectedFilter === "my" && styles.filterButtonTextActive
          ]}>My Posts</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredPosts}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View
            style={{ 
              flex: 1, 
              alignItems: "center", 
              justifyContent: "center", 
              backgroundColor: "white",
              marginVertical: 10,
              padding: 15,
              borderRadius: 12,
              // Android shadow
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "black" }}> 
              {item.title}</Text>
           <Swiper
              style={{ height: 350,}}
              loop={false}
              dotStyle={styles.dotStyle}
              activeDotColor="black"
            >
              {(JSON.parse(item.image_url)).map((uri, index) => (
                <View key={index} style={{alignItems: "center", justifyContent: "center"}}>
                  <Image
                    source={{ uri }}
                    style={{ width: 260, height: 300, }}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterButtonActive: {
    backgroundColor: "#e0e0e0",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#000",
    fontWeight: "500",
  },
  dotStyle: {
    backgroundColor: "white",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
});
