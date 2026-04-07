import { LoginProvider } from "./providers/login-state-provider";
import QueryProvider from "./providers/query-client-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import ProtectedRoute from "./providers/protected-route";
import AdminLayout from "./components/admin-layout";
import LoginPage from "./pages/login/login-page";
import DashboardPage from "./pages/dashboard/dashboard-page";
import ProfileListPage from "./pages/profiles/profile-list-page";
import ProfileDetailPage from "./pages/profiles/profile-detail-page";
import ProfileCreatePage from "./pages/profiles/profile-create-page";
import ProfileEditPage from "./pages/profiles/profile-edit-page";
import CategoryListPage from "./pages/categories/category-list-page";
import CategoryCreatePage from "./pages/categories/category-create-page";
import CategoryDetailPage from "./pages/categories/category-detail-page";
import CategoryEditPage from "./pages/categories/category-edit-page";
import TagListPage from "./pages/tags/tag-list-page";
import TagCreatePage from "./pages/tags/tag-create-page";
import TagDetailPage from "./pages/tags/tag-detail-page";
import TagEditPage from "./pages/tags/tag-edit-page";
import SeriesListPage from "./pages/series/series-list-page";
import SeriesCreatePage from "./pages/series/series-create-page";
import SeriesDetailPage from "./pages/series/series-detail-page";
import SeriesEditPage from "./pages/series/series-edit-page";
import PostListPage from "./pages/posts/post-list-page";
import PostCreatePage from "./pages/posts/post-create-page";
import PostDetailPage from "./pages/posts/post-detail-page";
import PostEditPage from "./pages/posts/post-edit-page";
import CommentListPage from "./pages/comments/comment-list-page";
import CommentDetailPage from "./pages/comments/comment-detail-page";
import BookmarkListPage from "./pages/bookmarks/bookmark-list-page";
import BookmarkCreatePage from "./pages/bookmarks/bookmark-create-page";
import BookmarkDetailPage from "./pages/bookmarks/bookmark-detail-page";
import BookmarkEditPage from "./pages/bookmarks/bookmark-edit-page";
import NewsletterSubscriberListPage from "./pages/newsletter-subscribers/newsletter-subscriber-list-page";
import NewsletterSubscriberCreatePage from "./pages/newsletter-subscribers/newsletter-subscriber-create-page";
import NewsletterSubscriberDetailPage from "./pages/newsletter-subscribers/newsletter-subscriber-detail-page";
import NewsletterSubscriberEditPage from "./pages/newsletter-subscribers/newsletter-subscriber-edit-page";
import LikeListPage from "./pages/likes/like-list-page";
import LikeCreatePage from "./pages/likes/like-create-page";
import LikeDetailPage from "./pages/likes/like-detail-page";
import LikeEditPage from "./pages/likes/like-edit-page";

function App() {
	return (
		<QueryProvider>
			<LoginProvider>
				<BrowserRouter>
					<Toaster />
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/" element={<ProtectedRoute />}>
							<Route path="/" element={<AdminLayout />}>
								<Route index element={<DashboardPage />} />
								<Route path="posts" element={<PostListPage />} />
								<Route path="posts/create" element={<PostCreatePage />} />
								<Route path="posts/:id" element={<PostDetailPage />} />
								<Route path="posts/:id/edit" element={<PostEditPage />} />
								<Route path="comments" element={<CommentListPage />} />
								<Route path="comments/:id" element={<CommentDetailPage />} />
								<Route path="bookmarks" element={<BookmarkListPage />} />
								<Route path="bookmarks/create" element={<BookmarkCreatePage />} />
								<Route path="bookmarks/:id" element={<BookmarkDetailPage />} />
								<Route path="bookmarks/:id/edit" element={<BookmarkEditPage />} />
								<Route path="newsletter-subscribers" element={<NewsletterSubscriberListPage />} />
								<Route path="newsletter-subscribers/create" element={<NewsletterSubscriberCreatePage />} />
								<Route path="newsletter-subscribers/:id" element={<NewsletterSubscriberDetailPage />} />
								<Route path="newsletter-subscribers/:id/edit" element={<NewsletterSubscriberEditPage />} />
								<Route path="likes" element={<LikeListPage />} />
								<Route path="likes/create" element={<LikeCreatePage />} />
								<Route path="likes/:id" element={<LikeDetailPage />} />
								<Route path="likes/:id/edit" element={<LikeEditPage />} />
								<Route path="profiles" element={<ProfileListPage />} />
								<Route path="profiles/create" element={<ProfileCreatePage />} />
								<Route path="profiles/:id" element={<ProfileDetailPage />} />
								<Route path="profiles/:id/edit" element={<ProfileEditPage />} />
								<Route path="categories" element={<CategoryListPage />} />
								<Route path="categories/create" element={<CategoryCreatePage />} />
								<Route path="categories/:id" element={<CategoryDetailPage />} />
								<Route path="categories/:id/edit" element={<CategoryEditPage />} />
								<Route path="tags" element={<TagListPage />} />
								<Route path="tags/create" element={<TagCreatePage />} />
								<Route path="tags/:id" element={<TagDetailPage />} />
								<Route path="tags/:id/edit" element={<TagEditPage />} />
								<Route path="series" element={<SeriesListPage />} />
								<Route path="series/create" element={<SeriesCreatePage />} />
								<Route path="series/:id" element={<SeriesDetailPage />} />
								<Route path="series/:id/edit" element={<SeriesEditPage />} />
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryProvider>
	);
}

export default App;
