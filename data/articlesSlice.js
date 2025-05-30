import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_KEY = 'YOUR_NEWS_API_KEY'; // Replace with your actual API key
const NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=3972bb1bbc19435fa9d72be80fe081a8`;

// Fetch articles from API
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(NEWS_API_URL);
      const articles = response.data.articles;

      // Cache to storage
      await AsyncStorage.setItem('@cached_articles', JSON.stringify(articles));

      return articles;
    } catch (error) {
      // Try to load from cache on failure
      const cached = await AsyncStorage.getItem('@cached_articles');
      if (cached) {
        return JSON.parse(cached);
      }
      return thunkAPI.rejectWithValue('Failed to fetch articles');
    }
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
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loadBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      });
  },
});

export const { addBookmark, removeBookmark } = articlesSlice.actions;
export default articlesSlice.reducer;
