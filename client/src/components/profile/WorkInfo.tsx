import React, { useState, useEffect, RefObject } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Loader2, Building2 } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { fetchProfile, updateWorkExperience } from "@/utils/ProfileApi";

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrent: boolean;
}

interface WorkFormData {
  work_experience: WorkExperience[];
}

interface WorkInfoProps {
  formRef?: RefObject<HTMLFormElement>;
  onSuccess?: () => void;
}

const WorkInfo: React.FC<WorkInfoProps> = ({ formRef, onSuccess }) => {
  const { user } = useAuthStore();
  const userId = user?.userId;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<WorkFormData>({
    defaultValues: {
      work_experience: [
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          isCurrent: false
        }
      ]
    }
  });

  useEffect(() => {
    const loadWorkExperience = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setFetchError(null);
      
      try {
        const result = await fetchProfile(userId);
        
        if (result.success && result.data) {
          const profileData = result.data;
          
          if (profileData.workEx && profileData.workEx.length > 0) {
            setIsSubmitted(true);
            const formattedWorkEx = profileData.workEx.map((exp: WorkExperience) => ({
              ...exp,
              startDate: exp.startDate?.split('T')[0] || "",
              endDate: exp.isCurrent ? "" : (exp.endDate?.split('T')[0] || "")
            }));
            form.reset({ work_experience: formattedWorkEx });
          }
        } else {
          setFetchError(result.error || "Failed to fetch work experience");
        }
      } catch (error) {
        console.error("Error loading work experience:", error);
        setFetchError("An unexpected error occurred while loading your work experience");
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkExperience();
  }, [userId, form]);

  const onSubmit: SubmitHandler<WorkFormData> = async (data) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      const result = await updateWorkExperience(userId, data.work_experience);
      
      if (result.success) {
        setIsSubmitted(true);
        onSuccess?.();
      } else {
        form.setError("root", {
          type: "manual",
          message: result.error || "Failed to update work experience"
        });
      }
    } catch (error) {
      console.error("Error submitting work experience:", error);
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addWorkExperience = () => {
    const current = form.getValues("work_experience");
    form.setValue("work_experience", [
      ...current,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrent: false
      }
    ]);
  };

  const removeWorkExperience = (index: number) => {
    const current = form.getValues("work_experience");
    if (current.length > 1) {
      const updated = current.filter((_, i) => i !== index);
      form.setValue("work_experience", updated);
    }
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    form.setValue(`work_experience.${index}.isCurrent`, checked);
    if (checked) {
      form.setValue(`work_experience.${index}.endDate`, "");
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0B60B0]" />
      </Card>
    );
  }

  if (fetchError) {
    return (
      <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
        <div className="text-red-500">{fetchError}</div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Card>
    );
  }

  const workExperiences = form.watch("work_experience") || [];

  return (
    <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
      {isSubmitted ? (
        <div className="space-y-4 text-lg">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#0B60B0]" />
            <h2 className="text-xl font-semibold text-[#0B60B0]">Work Experience</h2>
          </div>
          
          {workExperiences.length > 0 ? (
            workExperiences.map((work, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between">
                  <h3 className="font-medium text-lg">{work.position}</h3>
                  {work.isCurrent && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-[#0B60B0] font-medium">{work.company}</p>
                <p className="text-gray-500 text-sm">
                  {work.startDate} - {work.isCurrent ? "Present" : work.endDate}
                </p>
                <p className="mt-2">{work.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No work experience added yet.</p>
          )}
          
          <Button 
            variant="outline" 
            className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
            onClick={() => setIsSubmitted(false)}
          >
            Edit Work Experience
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#0B60B0]" />
              <h2 className="text-xl font-semibold text-[#0B60B0]">Work Experience</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">Add your professional experience, including full-time roles, internships, and part-time positions.</p>
            
            {workExperiences.map((_, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg space-y-3 relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  onClick={() => removeWorkExperience(index)}
                  disabled={workExperiences.length <= 1}
                >
                  <X size={20} />
                </button>
                <h3 className="text-lg font-medium">Experience {index + 1}</h3>
                
                <FormField
                  control={form.control}
                  name={`work_experience.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. Google, Microsoft, etc." 
                          required 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`work_experience.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. Software Engineer, Product Manager" 
                          required 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`work_experience.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                          required 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`work_experience.${index}.isCurrent`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => 
                            handleCheckboxChange(index, checked as boolean)
                          }
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Currently working here</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {!form.watch(`work_experience.${index}.isCurrent`) && (
                  <FormField
                    control={form.control}
                    name={`work_experience.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="date" 
                            required={!form.watch(`work_experience.${index}.isCurrent`)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`work_experience.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe your responsibilities, achievements, and the technologies you worked with" 
                          className="min-h-32"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={addWorkExperience}
                className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
              >
                Add Another Experience
              </Button>
              <Button 
                type="submit"
                className="bg-[#0B60B0] hover:bg-[#0B60B0]/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Work Experience"
                )}
              </Button>
            </div>

            {form.formState.errors.root && (
              <p className="text-red-500 bg-red-50 p-2 rounded">
                {form.formState.errors.root.message}
              </p>
            )}
          </form>
        </Form>
      )}
    </Card>
  );
};

export default WorkInfo;