import { createBrowserRouter, Navigate } from "react-router";
import { InterviewRoom } from "./components/InterviewRoom";
import { PreInterviewScreen } from "./components/PreInterviewScreen";
import { DashboardLayout } from "./components/DashboardLayout";
import { UserDashboard } from "./components/UserDashboard";
import { ApplicationsScreen } from "./components/ApplicationsScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { ProfileGenerationScreen } from "./components/ProfileGenerationScreen";
import { SettingsScreen } from "./components/SettingsScreen";
import { LandingPage } from "./components/LandingPage";
import { MatchesScreen } from "./components/MatchesScreen";
import { InterviewsScreen } from "./components/InterviewsScreen";
import { EmployerDashboard } from "./components/EmployerDashboard";
import { AuthPage } from "./components/AuthPage";
import { ChoosePathScreen } from "./components/ChoosePathScreen";
import { EmployerInterestScreen } from "./components/EmployerInterestScreen";
import { FollowUpChallengeScreen } from "./components/FollowUpChallengeScreen";
import { AboutPage } from "./components/AboutPage";
import { PricingPage } from "./components/PricingPage";
import { ContactPage } from "./components/ContactPage";
import { TermsPage } from "./components/TermsPage";
import { PrivacyPage } from "./components/PrivacyPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/candidate/start",
    Component: ChoosePathScreen,
  },
  {
    path: "/employer",
    Component: EmployerDashboard,
  },
  {
    path: "/candidate",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: UserDashboard,
      },
      {
        path: "applications",
        Component: ApplicationsScreen,
      },
      {
        path: "matches",
        Component: MatchesScreen,
      },
      {
        path: "interviews",
        Component: InterviewsScreen,
      },
      {
        path: "profile",
        Component: ProfileScreen,
      },
      {
        path: "generating",
        Component: ProfileGenerationScreen,
      },
      {
        path: "settings",
        Component: SettingsScreen,
      },
      {
        path: "interest",
        Component: EmployerInterestScreen,
      },
      {
        path: "challenge",
        Component: FollowUpChallengeScreen,
      },
    ],
  },
  {
    path: "/pre-interview",
    Component: PreInterviewScreen,
  },
  {
    path: "/interview",
    Component: InterviewRoom,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
  {
    path: "/pricing",
    Component: PricingPage,
  },
  {
    path: "/contact",
    Component: ContactPage,
  },
  {
    path: "/terms",
    Component: TermsPage,
  },
  {
    path: "/privacy",
    Component: PrivacyPage,
  },
  {
    path: "*",
    element: <Navigate to="/candidate" replace />
  }
]);