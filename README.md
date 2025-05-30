# NewsReader App

## Project Overview

The NewsReader App is a cross-platform mobile application built using React Native. It fetches and displays news articles from [NewsAPI.org](https://newsapi.org/). Users can view headlines, read full articles, bookmark their favorite news, and access content offline.

---

## Features

- **Home Screen:** Displays a list of latest news articles with title, source, date, and image thumbnail.
- **Details Screen:** Opens a full view of the article including content and link.
- **Search Functionality:** Allows users to search news using keywords.
- **Bookmarking:** Users can bookmark and remove bookmarks; saved locally.
- **Offline Mode:** Cached articles and bookmarks are accessible without internet.
- **Pull-to-Refresh:** Refresh the news feed manually.
- **Dark Mode:** Theme switch support.

---

## Folder Structure

```
NewsReader/
├── assets/         # App icons and splash assets
├── components/     # Reusable UI components (e.g., ArticleCard)
├── data/           # Redux slices, store, and local persistence
├── views/          # App screens (Home, Details, Search, Bookmarks)
├── App.js          # App entry with navigation
├── README.md       # Project documentation
├── package.json    # Project metadata and dependencies
└── ThemeContext    # To change from light to dark mode and vice versa
```

---

## Setup Instructions

1. **Clone the Repository:**
    git clone https://github.com/shivu06-pa/NewsReader.git
    cd NewsReader

2. **Install Dependencies:**
    npm install

3. **Start the App:**
    npx expo start

## Assumptions Made / Known Issues

- **Assumption:** API limit for NewsAPI may restrict results if exceeded.
- **Known Issue:** Offline access is limited to previously fetched sessions only.

---

## Improvements Planned

- Add pagination for long news lists.
- Integrate push notifications for breaking news.
- Add unit tests using Jest.
- Enhance dark mode support.
- Refactor with TypeScript and scalable UI theming.
