import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../data/articlesSlice';
import { useTheme } from '../ThemeContext';

export default function ArticleCard({ item, onPress }) {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const bookmarks = useSelector((state) => state.articles.bookmarks);
  const isBookmarked = bookmarks?.some((a) => a.url === item.url);

  const handleBookmark = () => {
    if (isBookmarked) {
      dispatch(removeBookmark(item));
    } else {
      dispatch(addBookmark(item));
    }
  };

  const backgroundColor = theme === 'dark' ? '#1e1e1e' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor }]}>
      {item?.urlToImage && (
        <Image source={{ uri: item.urlToImage }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{item?.title}</Text>
        <Text style={[styles.source, { color: textColor }]}>{item?.source?.name}</Text>
        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isBookmarked ? '#007AFF' : textColor}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  source: {
    fontSize: 12,
    marginVertical: 5,
  },
});
