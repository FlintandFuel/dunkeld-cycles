import App from './App.jsx'
import { BlogIndex, PostPage, AuthorPage } from './Blog.jsx'

// One component per route, shared by the browser (main.jsx) and the prerender (entry-server.jsx).
export default function Page({ route }) {
  if (route.name === 'post') return <PostPage slug={route.slug} />
  if (route.name === 'index') return <BlogIndex />
  if (route.name === 'author') return <AuthorPage />
  return <App />
}
