import { use } from "react";
import {
  BookCopyIcon,
  Gift,
  Key,
  Settings,
  Tag,
  Ticket,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@marginal.credit/ui/sidebar.tsx";
import { Spinner } from "@marginal.credit/ui/spinner.tsx";

import { ReaderContext } from "../core/reader/reader.context.tsx";

export const Menu = () => {
  const { readerList } = use(ReaderContext);

  const location = useLocation();

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/settings">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Key className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Marginal Key</span>
                  <span className="truncate text-xs">Station</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Readers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {readerList.length === 0 && (
                <div className="mt-2 ml-2 text-muted-foreground text-xs flex flex-1 gap-2">
                  <Spinner /> No readers connected
                </div>
              )}
              {readerList.map((reader) => (
                <SidebarMenuItem key={reader.id}>
                  <Link to={`/reader/${reader.id}`}>
                    <SidebarMenuButton
                      isActive={location.pathname === `/reader/${reader.id}`}
                    >
                      <BookCopyIcon />
                      <span className="truncate">{reader.name}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Station</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <Link to="/station/products">
                  <SidebarMenuButton
                    isActive={location.pathname === "/station/products"}
                  >
                    <Tag /> Products
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link to="/station/rewards">
                  <SidebarMenuButton
                    isActive={location.pathname === "/station/rewards"}
                  >
                    <Gift /> Rewards
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <Link to="/platform/shows">
                  <SidebarMenuButton
                    isActive={location.pathname === "/platform/shows"}
                  >
                    <Ticket /> Shows
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                {/*<Link to="/platform/users">*/}
                <SidebarMenuButton
                  disabled
                  isActive={location.pathname === "/platform/users"}
                >
                  <Users /> Users
                </SidebarMenuButton>
                {/*</Link>*/}
              </SidebarMenuItem>
              <SidebarMenuItem>
                {/*<Link to="/platform/keys">*/}
                <SidebarMenuButton
                  disabled
                  isActive={location.pathname === "/platform/keys"}
                >
                  <Key /> Keys
                </SidebarMenuButton>
                {/*</Link>*/}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <Link to="/settings">
              <SidebarMenuButton isActive={location.pathname === "/settings"}>
                <Settings /> Settings
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
