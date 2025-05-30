import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../data/articlesSlice';
import { useTheme } from '../ThemeContext';

export default function DetailScreen({ route }) {
  const { article } = route.params || {};
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.articles.bookmarks);
  const isBookmarked = bookmarks?.some((a) => a.url === article.url);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#121212' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const linkColor = isDark ? '#66b2ff' : '#1e90ff';

  const handleBookmark = () => {
    if (isBookmarked) {
      dispatch(removeBookmark(article));
    } else {
      dispatch(addBookmark(article));
    }
  };

  if (!article) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          No article data available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{article.title}</Text>
        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isDark ? '#66b2ff' : '#000'}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.meta, { color: isDark ? '#ccc' : '#666' }]}>
        {article.source?.name || 'Unknown'} •{' '}
        {new Date(article.publishedAt).toLocaleString()}
      </Text>

      <Text style={[styles.description, { color: textColor }]}>
        {article.description}
      </Text>

      <Text style={[styles.content, { color: textColor }]}>{article.content}</Text>

      <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
        <Text style={[styles.link, { color: linkColor }]}>Read More</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  meta: {
    marginVertical: 8,
    fontSize: 13,
  },
  description: {
    fontSize: 16,
    marginVertical: 4,
  },
  content: {
    fontSize: 14,
    marginTop: 4,
  },
  link: {
    marginTop: 12,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
