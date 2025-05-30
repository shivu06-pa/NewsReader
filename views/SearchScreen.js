import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import ArticleCard from '../components/ArticleCard';
import { useTheme } from '../ThemeContext'; // make sure path is correct

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const articles = useSelector((state) => state.articles.data);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const styles = getStyles(isDark);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search News</Text>
      <TextInput
        style={styles.input}
        placeholder="Type to search..."
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <ArticleCard
            item={item}
            onPress={() => navigation.navigate('Details', { article: item })}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No articles found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 12,
      color: isDark ? '#fff' : '#333',
      textAlign: 'center',
    },
    input: {
      height: 50,
      borderColor: isDark ? '#444' : '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: isDark ? '#aaa' : '#888',
      fontSize: 16,
    },
  });
