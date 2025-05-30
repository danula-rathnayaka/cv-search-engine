import { ThemeProvider } from "./components/theme-provider";
import Home from "./pages/Home";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="mt-10">
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default App;
