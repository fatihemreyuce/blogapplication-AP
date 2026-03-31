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
							</Route>
						</Route>
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryProvider>
	);
}

export default App;
