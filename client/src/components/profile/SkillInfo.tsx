import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, X } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

// Tech skills suggestions based on common technologies
const suggestedSkills = [
  "JavaScript", "TypeScript", "React", "Angular", "Vue.js", 
  "Node.js", "Express", "Python", "Django", "Flask",
  "Java", "Spring Boot", "C#", ".NET Core", "PHP",
  "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
  "MongoDB", "MySQL", "PostgreSQL", "Redis", "GraphQL",
  "TensorFlow", "PyTorch", "Data Science", "Machine Learning", "DevOps"
];

interface SkillInfoForm {
  skills: string[];
}

const SkillInfo = ({ formRef, onSuccess }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const API_BASE_URL = "http://localhost:8000/api";

  // Initialize the form with default value
  const form = useForm<SkillInfoForm>({
    defaultValues: {
      skills: [],
    },
  });

  // Current skills in the form
  const currentSkills = form.watch("skills") || [];

  // Input ref for the skill input field
  const skillInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch user skills when component mounts
  useEffect(() => {
    const fetchSkills = async () => {
      if (!user?.userId) return;
      
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/${user.userId}/getprofile`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        const profileData = response.data;
        
        // If skills exist in profile data
        if (profileData.skills && profileData.skills.length > 0) {
          setIsSubmitted(true);
          form.reset({ skills: profileData.skills });
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to load skills. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [user, form]);

  // Handle form submission
  const onSubmit = async (data: SkillInfoForm) => {
    if (!user?.userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/profile/${user.userId}/skill_info`, 
        { skills: data.skills },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        setIsSubmitted(true);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage = err.response?.data?.detail || "Failed to update skills. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a skill
  const addSkill = (skill: string) => {
    const skillToAdd = skill.trim();
    
    // Don't add empty skills or duplicates
    if (skillToAdd && !currentSkills.includes(skillToAdd)) {
      const updatedSkills = [...currentSkills, skillToAdd];
      form.setValue("skills", updatedSkills);
      
      // Clear the input field if it's the source
      if (skillInputRef.current) {
        skillInputRef.current.value = "";
      }
    }
  };

  // Handle removing a skill
  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = currentSkills.filter(skill => skill !== skillToRemove);
    form.setValue("skills", updatedSkills);
  };

  // Handle adding a skill via keyboard
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInputRef.current?.value) {
      e.preventDefault();
      addSkill(skillInputRef.current.value);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 w-full max-w-3xl bg-background border-none shadow-none flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0B60B0]" />
      </Card>
    );
  }

  return (
    <Card className="p-6 w-full max-w-3xl bg-background border-none shadow-none">
      {isSubmitted ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#0B60B0]">Skills</h2>
          
          {currentSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill, index) => (
                <Badge 
                  key={index}
                  className="px-3 py-1.5 text-sm bg-[#0B60B0]/10 text-[#0B60B0] hover:bg-[#0B60B0]/20 border-0"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
          
          <Button 
            variant="outline" 
            className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white mt-4"
            onClick={() => setIsSubmitted(false)}
          >
            Edit Skills
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0B60B0]">Skills</h2>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel>Add Your Skills</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input
                          ref={skillInputRef}
                          placeholder="Type a skill and press Enter"
                          onKeyDown={handleKeyDown}
                          className="flex-1"
                        />
                      </FormControl>
                      <Button 
                        type="button"
                        onClick={() => skillInputRef.current && addSkill(skillInputRef.current.value)}
                        className="bg-[#0B60B0] hover:bg-[#0B60B0]/90 text-white"
                      >
                        Add
                      </Button>
                    </div>
                    <FormMessage />
                    
                    {/* Added skills */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {currentSkills.map((skill, index) => (
                        <Badge 
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm flex items-center gap-1 hover:bg-gray-200"
                        >
                          {skill}
                          <button 
                            type="button" 
                            onClick={() => removeSkill(skill)}
                            className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            
              {/* Suggested skills */}
              <div className="mt-8">
                <h3 className="font-medium mb-3">Suggested Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {currentSkills.length} {currentSkills.length === 1 ? 'skill' : 'skills'} added
              </p>
              
              <Button 
                type="submit" 
                className="bg-[#0B60B0] hover:bg-[#0B60B0]/90 text-white"
                disabled={isLoading || currentSkills.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Skills"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Card>
  );
};

export default SkillInfo;