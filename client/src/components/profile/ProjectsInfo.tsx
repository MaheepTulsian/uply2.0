import React, { useState, useEffect, RefObject } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Loader2, FolderGit2 } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { fetchProfile, updateProjects } from "@/utils/ProfileApi";

interface Project {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  technologiesUsed: string[];
  projectLink?: string;
  isOpenSource: boolean;
}

interface ProjectFormValues {
  projects: Project[];
}

interface ProjectsInfoProps {
  formRef?: RefObject<HTMLFormElement>;
  onSuccess?: () => void;
}

const ProjectsInfo: React.FC<ProjectsInfoProps> = ({ formRef, onSuccess }) => {
  const { user } = useAuthStore();
  const userId = user?.userId;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<ProjectFormValues>({
    defaultValues: {
      projects: [
        {
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          technologiesUsed: [],
          projectLink: "",
          isOpenSource: false
        }
      ]
    }
  });

  useEffect(() => {
    const loadProjects = async () => {
      if (!userId) return;

      setIsLoading(true);
      setFetchError(null);

      try {
        const result = await fetchProfile(userId);
        
        if (result.success && result.data) {
          const profileData = result.data;
          
          if (profileData.projects && profileData.projects.length > 0) {
            setIsSubmitted(true);
            const formattedProjects = profileData.projects.map((project: Project) => ({
              ...project,
              startDate: project.startDate?.split("T")[0] || "",
              endDate: project.endDate?.split("T")[0] || "",
              technologiesUsed: project.technologiesUsed || []
            }));
            form.reset({ projects: formattedProjects });
          }
        } else {
          setFetchError(result.error || "Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        setFetchError("An unexpected error occurred while loading your projects");
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [userId, form]);

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Make sure all projects have technologiesUsed array
      const validatedProjects = data.projects.map(project => ({
        ...project,
        technologiesUsed: project.technologiesUsed || []
      }));
      
      const result = await updateProjects(userId, validatedProjects);
      
      if (result.success) {
        setIsSubmitted(true);
        onSuccess?.();
      } else {
        form.setError("root", {
          type: "manual",
          message: result.error || "Failed to update projects"
        });
      }
    } catch (error) {
      console.error("Error submitting projects:", error);
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = () => {
    const currentProjects = form.getValues("projects");
    form.setValue("projects", [
      ...currentProjects,
      {
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        technologiesUsed: [],
        projectLink: "",
        isOpenSource: false
      }
    ]);
  };

  const removeProject = (index: number) => {
    const currentProjects = form.getValues("projects");
    if (currentProjects.length > 1) {
      const updatedProjects = currentProjects.filter((_, i) => i !== index);
      form.setValue("projects", updatedProjects);
    }
  };

  const handleAddTech = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value.trim() !== "") {
      event.preventDefault();
      const newTech = event.currentTarget.value.trim();
      const updatedProjects = [...form.getValues("projects")];
      
      // Initialize technologiesUsed array if it doesn't exist
      if (!updatedProjects[index].technologiesUsed) {
        updatedProjects[index].technologiesUsed = [];
      }
      
      updatedProjects[index].technologiesUsed.push(newTech);
      form.setValue("projects", updatedProjects);
      event.currentTarget.value = "";
    }
  };

  const handleRemoveTech = (index: number, tech: string) => {
    const updatedProjects = [...form.getValues("projects")];
    if (updatedProjects[index].technologiesUsed) {
      updatedProjects[index].technologiesUsed = updatedProjects[index].technologiesUsed.filter(
        (t) => t !== tech
      );
      form.setValue("projects", updatedProjects);
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

  const currentProjects = form.watch("projects") || [];

  return (
    <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
      {isSubmitted ? (
        <div className="space-y-4 text-lg">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-[#0B60B0]" />
            <h2 className="text-xl font-semibold text-[#0B60B0]">Projects</h2>
          </div>
          
          {currentProjects.length > 0 ? (
            currentProjects.map((project, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-lg">{project.title}</h3>
                <p className="text-gray-700">{project.description}</p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Period:</span> {project.startDate} to {project.endDate || "Present"}
                </p>
                
                {project.technologiesUsed && project.technologiesUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    <span className="font-medium text-sm">Technologies:</span>
                    <div className="flex flex-wrap gap-1">
                      {project.technologiesUsed.map((tech, i) => (
                        <Badge key={i} variant="secondary" className="bg-[#0B60B0]/10 text-[#0B60B0] border-0">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {project.projectLink && (
                  <p className="text-sm">
                    <span className="font-medium">Link:</span>
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B60B0] hover:underline ml-2"
                    >
                      View Project
                    </a>
                  </p>
                )}
                
                {project.isOpenSource && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Open Source
                  </Badge>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects added yet.</p>
          )}
          
          <Button 
            variant="outline" 
            className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
            onClick={() => setIsSubmitted(false)}
          >
            Edit Projects
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-6 w-6 text-[#0B60B0]" />
              <h2 className="text-xl font-semibold text-[#0B60B0]">Projects</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Add details about personal or professional projects you've worked on.
            </p>
            
            {currentProjects.map((project, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg space-y-3 relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  onClick={() => removeProject(index)}
                  disabled={currentProjects.length <= 1}
                >
                  <X size={20} />
                </button>

                <h3 className="text-lg font-medium">Project {index + 1}</h3>

                <FormField
                  control={form.control}
                  name={`projects.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. E-commerce Website, Mobile App, etc."
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`projects.${index}.startDate`}
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
                    name={`projects.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Leave blank if ongoing)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`projects.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe what the project does, your role, and the impact"
                          required
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Technologies Used</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Type a technology and press Enter (e.g. React, Node.js)"
                      onKeyDown={(e) => handleAddTech(index, e)}
                    />
                  </FormControl>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologiesUsed?.map((tech, i) => (
                      <Badge
                        key={i}
                        className="cursor-pointer bg-[#0B60B0]/10 hover:bg-[#0B60B0]/20 text-[#0B60B0] border-0"
                        onClick={() => handleRemoveTech(index, tech)}
                      >
                        {tech} ✕
                      </Badge>
                    ))}
                  </div>
                </FormItem>

                <FormField
                  control={form.control}
                  name={`projects.${index}.projectLink`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Link</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://example.com/project"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`projects.${index}.isOpenSource`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is Open Source</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <div className="flex gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={addProject}
                className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
              >
                Add Another Project
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
                  "Save Projects"
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

export default ProjectsInfo;