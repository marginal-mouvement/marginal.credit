import { Routes, Route, Navigate } from "react-router";
import { use } from "react";
import { SidebarProvider } from "@marginal.credit/ui/sidebar.tsx";

import { ReaderContext } from "./core/reader/reader.context.tsx";
import { ShowContextProvider } from "./core/show/show.context.tsx";
import { Menu } from "./parts/menu.tsx";
import { ReaderPage } from "./pages/readers/reader.page.tsx";
import { ProductsPage } from "./pages/station/products/products.page.tsx";
import { RewardsPage } from "./pages/station/rewards/rewards.page.tsx";
import { ShowsPage } from "./pages/platform/shows/shows.page.tsx";
import { SettingsPage } from "./pages/settings/settings.page.tsx";

const DEFAULT_ROUTE = "/settings";

export function App() {
  const { readerList } = use(ReaderContext);
  return (
    <SidebarProvider>
      <ShowContextProvider>
        <Menu />
        <Routes>
          {/* --- READERS --- */}
          {readerList.map((reader) => (
            <Route
              key={reader.id}
              path={`/reader/${reader.id}`}
              element={
                <ReaderPage readerId={reader.id} readerName={reader.name} />
              }
            />
          ))}

          {/* --- STATION --- */}
          <Route path="/station/products" element={<ProductsPage />} />
          <Route path="/station/rewards" element={<RewardsPage />} />

          {/* --- PLATFORM --- */}
          <Route path="platform/shows" element={<ShowsPage />} />

          <Route path={DEFAULT_ROUTE} element={<SettingsPage />} />

          <Route path="*" element={<Navigate to={DEFAULT_ROUTE} />} />
        </Routes>
      </ShowContextProvider>
    </SidebarProvider>
  );
}

export default App;
