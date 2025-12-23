import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StudentPhases from "./pages/dashboard/StudentPhases";
import StudentDiary from "./pages/dashboard/StudentDiary";
import StudentDocuments from "./pages/dashboard/StudentDocuments";
import StudentSchedule from "./pages/dashboard/StudentSchedule";
import MentorDashboard from "./pages/dashboard/MentorDashboard";
import MentorGroups from "./pages/dashboard/MentorGroups";
import MentorReviews from "./pages/dashboard/MentorReviews";
import MentorDiaryReviews from "./pages/dashboard/MentorDiaryReviews";
import MentorAnnouncements from "./pages/dashboard/MentorAnnouncements";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/student/phases" element={<StudentPhases />} />
          <Route path="/dashboard/student/diary" element={<StudentDiary />} />
          <Route path="/dashboard/student/documents" element={<StudentDocuments />} />
          <Route path="/dashboard/student/schedule" element={<StudentSchedule />} />
          <Route path="/dashboard/mentor" element={<MentorDashboard />} />
          <Route path="/dashboard/mentor/groups" element={<MentorGroups />} />
          <Route path="/dashboard/mentor/reviews" element={<MentorReviews />} />
          <Route path="/dashboard/mentor/diary-reviews" element={<MentorDiaryReviews />} />
          <Route path="/dashboard/mentor/announcements" element={<MentorAnnouncements />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
