import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../data/articlesSlice';
import ArticleCard from '../components/ArticleCard';
import { useTheme } from '../ThemeContext'; // Make sure ThemeContext path is correct

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.articles);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(fetchArticles());
  }, []);

  const isDark = theme === 'dark';
  const themedStyles = getStyles(isDark);

  return (
    <View style={themedStyles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <ArticleCard
            item={item}
            onPress={() => navigation.navigate('Details', { article: item })}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={() => dispatch(fetchArticles())}
            tintColor={isDark ? '#fff' : '#000'}
          />
        }
        ListEmptyComponent={
          <Text style={themedStyles.emptyText}>No articles available.</Text>
        }
      />
    </View>
  );
}

const getStyles = (isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#121212' : '#fff',
      paddingHorizontal: 12,
      paddingTop: 8,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: isDark ? '#ccc' : '#555',
    },
  });
