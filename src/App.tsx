import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./providers/ThemeProvider";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AnnouncementBar from "./components/AnnouncementBar";
import Home from "./pages/Home";
import CurrentIssue from "./pages/CurrentIssue";
import Departments from "./pages/Departments";
import Students from "./pages/Students";
import Submit from "./pages/Submit";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Archive from "./pages/Archive";
import About from "./pages/About";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import Credits from "./pages/Credits";
import NotFound from "./pages/NotFound";
import Feedback from "./components/Feedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="pratyush-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Header />
              <AnnouncementBar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/current-issue" element={<CurrentIssue />} />
                  <Route path="/departments" element={<Departments />} />
                  <Route path="/students" element={<Students />} />
                  <Route path="/submit" element={<Submit />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/archive" element={<Archive />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/credits" element={<Credits />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <Feedback />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
