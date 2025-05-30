import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import ArticleCard from '../components/ArticleCard';

export default function BookmarkScreen({ navigation }) {
  const bookmarks = useSelector((state) => state.articles.bookmarks);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <ArticleCard item={item} onPress={() => navigation.navigate('Details', { article: item })} />
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No bookmarks found.</Text>}
      />
    </View>
  );
}