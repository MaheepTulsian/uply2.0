import React, { useState, ReactElement, useEffect } from "react";
import PersonalInfo from "@/components/profile/PersonalInfo";
import AcademicInfo from "@/components/profile/AcademicInfo";
import ProjectsInfo from "@/components/profile/ProjectsInfo";
import SkillInfo from "@/components/profile/SkillInfo";
import WorkInfo from "@/components/profile/WorkInfo";
import CertificationInfo from "@/components/profile/CertificationInfo";
import AchievementInfo from "@/components/profile/AchievementInfo";
import PublicationInfo from "@/components/profile/PublicationInfo";
import SocialInfo from "@/components/profile/SocialInfo";
import {
  UserPen,
  School,
  FolderGit2,
  Brain,
  Building2,
  ScrollText,
  FileBadge,
  Trophy,
  Link,
  Zap,
} from "lucide-react";

interface Tab {
  name: string;
  component: ReactElement;
  icon: ReactElement;
}

const tabs: Tab[] = [
  { name: "Personal Info", component: <PersonalInfo />, icon: <UserPen /> },
  { name: "Academic Info", component: <AcademicInfo />, icon: <School /> },
  { name: "Projects", component: <ProjectsInfo />, icon: <FolderGit2 /> },
  { name: "Skills", component: <SkillInfo />, icon: <Brain /> },
  { name: "Work Experience", component: <WorkInfo />, icon: <Building2 /> },
  { name: "Certifications", component: <CertificationInfo />, icon: <FileBadge /> },
  { name: "Achievements", component: <AchievementInfo />, icon: <Trophy /> },
  { name: "Publications", component: <PublicationInfo />, icon: <ScrollText /> },
  { name: "Social Links", component: <SocialInfo />, icon: <Link /> },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="w-full bg-white/80 backdrop-blur-md border-b transition-shadow duration-300 mb-10">
        <div className="container px-4 sm:px-6 lg:px-8 xl:px-20 mx-auto h-12 flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-bold text-[#0B60B0] flex items-center">
            <Zap className="mr-2" />
            uply
          </div>
        </div>
      </header>
      <div className={`flex flex-col md:flex-row h-[calc(100vh-6rem)] ${!isMobile ? "px-28" : "mx-4"}`}>
        {/* Sidebar Tabs or Mobile Dropdown */}
        <div className="w-full md:w-1/4 space-y-4 sticky top-16 z-50 md:block">
          {isMobile ? (
            <select
              className="w-full h-10 p-2 rounded-lg border"
              value={activeTab}
              onChange={(e) => setActiveTab(parseInt(e.target.value))}
            >
              {tabs.map((tab, index) => (
                <option key={index} value={index}>
                  {tab.name}
                </option>
              ))}
            </select>
          ) : (
            tabs.map((tab, index) => (
              <button
                key={index}
                className={`block w-full text-left p-2 rounded-lg transition-all ${activeTab === index ? "bg-primary text-white" : ""
                  }`}
                onClick={() => setActiveTab(index)}
              >
                <div className="flex items-center">
                  <div className="mr-2">{tab.icon}</div>
                  <span>{tab.name}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Content Area */}
        <div className={`w-full md:w-3/4 px-4 flex justify-center overflow-y-auto ${isMobile ? "mt-5 mb-10" : ""}`}>
          {tabs[activeTab].component}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
