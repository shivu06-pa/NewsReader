import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_KEY = 'YOUR_NEWS_API_KEY'; // Replace with your actual API key
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=3972bb1bbc19435fa9d72be80fe081a8`;

// Fetch articles from API and update cache, detect if up to date
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(NEWS_API_URL);
      const articles = response.data.articles;

      // Get cached articles
      const cached = await AsyncStorage.getItem('@cached_articles');
      const cachedArticles = cached ? JSON.parse(cached) : [];

      // Compare new and cached articles
      const isSame =
        cachedArticles.length === articles.length &&
        cachedArticles.every((a, i) => a.url === articles[i].url);

      // Cache to storage if different
      if (!isSame) {
        await AsyncStorage.setItem('@cached_articles', JSON.stringify(articles));
      }

      return { articles, isSame };
    } catch (error) {
      // Try to load from cache on failure
      const cached = await AsyncStorage.getItem('@cached_articles');
      if (cached) {
        return { articles: JSON.parse(cached), isSame: true };
      }
      return thunkAPI.rejectWithValue('Failed to fetch articles');
    }
  }
);

// Load cached articles from storage (for offline/initial load)
export const loadCachedArticles = createAsyncThunk(
  'articles/loadCachedArticles',
  async () => {
    const cached = await AsyncStorage.getItem('@cached_articles');
    return cached ? JSON.parse(cached) : [];
  }
);

// Load bookmarks from storage
export const loadBookmarks = createAsyncThunk(
  'articles/loadBookmarks',
  async () => {
    const bookmarks = await AsyncStorage.getItem('@bookmarked_articles');
    return bookmarks ? JSON.parse(bookmarks) : [];
  }
);

// Slice
const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    data: [],
    bookmarks: [],
    status: 'idle',
    error: null,
    isUpToDate: false, // Add this flag
  },
  reducers: {
    addBookmark: (state, action) => {
      const exists = state.bookmarks.some((a) => a.url === action.payload.url);
      if (!exists) {
        state.bookmarks.push(action.payload);
        AsyncStorage.setItem('@bookmarked_articles', JSON.stringify(state.bookmarks));
      }
    },
    removeBookmark: (state, action) => {
      state.bookmarks = state.bookmarks.filter((a) => a.url !== action.payload.url);
      AsyncStorage.setItem('@bookmarked_articles', JSON.stringify(state.bookmarks));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
        state.isUpToDate = false;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.articles;
        state.isUpToDate = action.payload.isSame;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isUpToDate = false;
      })
      .addCase(loadCachedArticles.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(loadBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      });
  },
});

export const { addBookmark, removeBookmark } = articlesSlice.actions;
export default articlesSlice.reducer;