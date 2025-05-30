import React, { useEffect } from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

import store from './data/store';
import HomeScreen from './views/HomeScreen';
import DetailScreen from './views/DetailScreen';
import SearchScreen from './views/SearchScreen';
import BookmarkScreen from './views/BookmarkScreen';
import { loadBookmarks } from './data/articlesSlice';
import { ThemeProvider, useTheme } from './ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
            <Ionicons
              name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={theme === 'dark' ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Stack.Screen name="Details" component={DetailScreen} />
    </Stack.Navigator>
  );
}


function TabsNavigator() {
  const bookmarks = useSelector((state) => state.articles.bookmarks);
  const hasBookmarks = bookmarks?.length > 0;
  const { theme, toggleTheme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerRight: () => (
          <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
            <Ionicons
              name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={theme === 'dark' ? '#fff' : '#000'}
            />
          </TouchableOpacity>
        ),
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = 'home-outline';
          else if (route.name === 'Search') iconName = 'search-outline';
          else if (route.name === 'Bookmarks') iconName = 'bookmark-outline';

          const iconColor =
            route.name === 'Bookmarks' && hasBookmarks ? '#007AFF' : color;

          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: 'Home', headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: 'Search' }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarkScreen}
        options={{ title: 'Bookmarks' }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const { theme } = useTheme();

  useEffect(() => {
    AsyncStorage.getItem('@bookmarked_articles').then((data) => {
      if (data) dispatch(loadBookmarks(JSON.parse(data)));
    });
  }, []);

  return (
    <>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <TabsNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}
