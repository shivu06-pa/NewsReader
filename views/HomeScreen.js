import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../data/articlesSlice';
import ArticleCard from '../components/ArticleCard';
import { useTheme } from '../ThemeContext'; // Make sure ThemeContext path is correct

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { data, status, isUpToDate } = useSelector((state) => state.articles);
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(fetchArticles());
  }, []);

  const isDark = theme === 'dark';
  const themedStyles = getStyles(isDark);

  return (
    <View style={themedStyles.container}>
      {status === 'loading' && data.length === 0 && (
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} style={{ marginTop: 32 }} />
      )}
      {/* Show message if news is up to date and there is at least one article */}
      {isUpToDate && status === 'succeeded' && data.length > 0 && (
        <Text style={{ textAlign: 'center', marginVertical: 8, color: isDark ? '#ccc' : '#555' }}>
          No new articles. Already up to date!
        </Text>
      )}
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
          status !== 'loading' && (
            <Text style={themedStyles.emptyText}>No articles available.</Text>
          )
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