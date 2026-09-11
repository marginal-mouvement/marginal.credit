import { Navigate, Route, Routes } from "react-router";

import { TransferContextProvider } from "../modules/transfer/transfer.context.tsx";
import { GatePage } from "../pages/gate/gate.page.tsx";
import { TransactionsPage } from "../pages/transactions/transactions.page.tsx";
import { ProfilePage } from "../pages/profile/profile.page.tsx";
import { Menu } from "../parts/menu.tsx";

export const AuthenticatedContainer = () => {
  return (
    <TransferContextProvider>
      <Routes>
        <Route path="/" element={<GatePage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
      <Menu />
    </TransferContextProvider>
  );
};
