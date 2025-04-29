import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BookOpen,
  MessageSquare,
  Code,
  ChevronRight,
  Zap,
  UserCircle,
} from "lucide-react";
import resume from "@/assets/resume.svg";
import interview from "@/assets/interview.svg";
import apply from "@/assets/apply.svg";
import practice from "@/assets/paractice.svg";
import jd from "@/assets/jd.svg";
import useAuthStore from "@/store/useAuthStore";

// Feature cards data - updated to match Uply features
const featureCards = [
  {
    title: "AI Resume & Cover Letter Builder",
    icon: <FileText className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#0B60B0]" />,
    image: resume,
    color: "bg-blue-50",
    path: "/resume-builder"
  },
  {
    title: "JD-based Prep Material Generator",
    icon: <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#0B60B0]" />,
    image: jd,
    color: "bg-blue-50",
    path: "/jd-prep"
  },
  {
    title: "AI Mock Interviews",
    icon: <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#0B60B0]" />,
    image: interview,
    color: "bg-blue-50",
    path: "/mock-interviews"
  },
  {
    title: "Company-wise Leetcode Questions",
    icon: <Code className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#0B60B0]" />,
    image: practice,
    color: "bg-blue-50",
    path: "/leetcode-questions"
  },
  {
    title: "Automatically fill job applications",
    icon: <Zap className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-[#0B60B0]" />,
    image: apply,
    color: "bg-blue-50",
    path: "/auto-fill"
  }
];

// Dummy data for recent activity
const recentLectures = [
  {
    id: 1,
    title: "NextJS",
    type: "Topic Base Lecture",
    time: "5 hours ago",
    icon: <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"></div>
  },
  {
    id: 2,
    title: "Digital Marketing",
    type: "Topic Base Lecture",
    time: "2 days ago",
    icon: <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"></div>
  },
];

// Dummy data for feedback/progress
const feedbackItems = [
  {
    id: 1,
    title: "React Native",
    type: "Ques Ans Prep",
    time: "an hour ago",
    icon: <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-500"></div>
  },
  {
    id: 2,
    title: "React Native",
    type: "Ques Ans Prep",
    time: "an hour ago",
    icon: <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-purple-500"></div>
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Get user information from auth store
  const { user } = useAuthStore();
  const username = user?.email;
  // Extract the part before @ from email
  const regex = /^([^@]*)/;
  const match = username?.match(regex)?.[1] || username || "User";

  // Handle card click navigation
  const handleCardClick = (path: string) => {
    navigate(path);
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b transition-shadow duration-300 py-4">
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <div className="text-xl sm:text-2xl font-bold text-[#0B60B0] flex items-center">
            <Zap className="mr-2" />
            uply
          </div>
          {/* Profile button for desktop */}
          <div className="hidden sm:block">
            <Button 
              className="bg-[#0B60B0] hover:bg-[#0B60B0]/80 text-white"
              onClick={handleProfileClick}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs sm:text-sm text-gray-500">My Workspace</div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">Welcome back, {match}</h1>
            </div>
          </div>

          {/* Profile button for mobile */}
          <div className="sm:hidden mt-3">
            <Button 
              className="bg-[#0B60B0] hover:bg-[#0B60B0]/80 text-white text-sm px-3 py-1 h-8"
              onClick={handleProfileClick}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {featureCards.map((card, index) => (
            <Card
              key={index}
              className="flex flex-col items-center justify-center p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleCardClick(card.path)}
            >
              <CardContent className="p-0 flex flex-col items-center space-y-3 sm:space-y-4 w-full">
                <div className="relative">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain"
                  />
                </div>
                <h3 className="font-medium text-center text-xs sm:text-sm md:text-base">{card.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* History and Feedback Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Recent Lectures Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Your Previous Lectures</h2>
            <div className="space-y-3 sm:space-y-4">
              {recentLectures.map((lecture) => (
                <div key={lecture.id} className="flex items-center space-x-3 sm:space-x-4 py-2 sm:py-3 border-b border-gray-100">
                  {lecture.icon}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base truncate">{lecture.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{lecture.type}</p>
                    <p className="text-xs text-gray-400">{lecture.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#0B60B0] hidden sm:flex">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 mt-6 md:mt-0">Feedback</h2>
            <div className="space-y-3 sm:space-y-4">
              {feedbackItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 py-2 sm:py-3 border-b border-gray-100">
                  {item.icon}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base truncate">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{item.type}</p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#0B60B0] hidden sm:flex">
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;