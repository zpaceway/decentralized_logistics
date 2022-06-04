import * as React from "react";

import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  Logout,
  Person,
  Menu as MenuIcon,
  AirplaneTicket,
  ShoppingCart,
  Storefront,
} from "@mui/icons-material";
import { logout } from "../firebase";

const drawerWidth = 240;

const TOP_MENU = [
  {
    title: "Account",
    icon: Person,
    action: () => (window.location.href = "/dashboard/account"),
  },
  {
    title: "Consumer",
    icon: ShoppingCart,
    action: () => (window.location.href = "/dashboard/consumer"),
  },
  {
    title: "Keeper",
    icon: Storefront,
    action: () => (window.location.href = "/dashboard/keeper"),
  },
  {
    title: "Traveler",
    icon: AirplaneTicket,
    action: () => (window.location.href = "/dashboard/flights"),
  },
];
const BOTTOM_MENU = [{ title: "Logout", icon: Logout, action: () => logout() }];

function ResponsiveDrawer({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {TOP_MENU.map((menuItem) => (
          <ListItem
            key={menuItem.title}
            disablePadding
            onClick={menuItem.action}
          >
            <ListItemButton>
              <ListItemIcon>{<menuItem.icon />}</ListItemIcon>
              <ListItemText primary={menuItem.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {BOTTOM_MENU.map((menuItem) => (
          <ListItem
            key={menuItem.title}
            disablePadding
            onClick={menuItem.action}
          >
            <ListItemButton>
              <ListItemIcon>{<menuItem.icon />}</ListItemIcon>
              <ListItemText primary={menuItem.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        color="primary"
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },

          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                fontWeight: "bolder",
              }}
            >
              CARGO <AirplaneTicket></AirplaneTicket>
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: "40px 8px",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default ResponsiveDrawer;
