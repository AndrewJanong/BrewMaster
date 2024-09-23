import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { routeTree } from "./routeTree.gen";
import { createTheme, ThemeProvider } from "@mui/material";
import './App.css';

const queryClient = new QueryClient();

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface Register {
        route: typeof router;
    }
}

const theme = createTheme({
    typography: {
        fontFamily: 'Quicksand',
        fontWeightLight: 400,
        fontWeightRegular: 500,
        fontWeightMedium: 600,
        fontWeightBold: 700,
    },
    palette: {
        
    }
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App