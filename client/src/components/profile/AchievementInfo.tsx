import React, { useState, useEffect, RefObject } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2 } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { fetchProfile, updateAchievements } from "@/utils/ProfileApi";

interface Achievement {
  title: string;
  description: string;
  date: string;
  issuer: string;
}

interface AchievementFormData {
  achievements: Achievement[];
}

interface AchievementInfoProps {
  formRef?: RefObject<HTMLFormElement>;
  onSuccess?: () => void;
}

const AchievementInfo: React.FC<AchievementInfoProps> = ({ formRef, onSuccess }) => {
  const { user } = useAuthStore();
  const userId = user?.userId;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<AchievementFormData>({
    defaultValues: {
      achievements: [
        { title: "", description: "", date: "", issuer: "" }
      ]
    }
  });

  useEffect(() => {
    const loadAchievements = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setFetchError(null);
      
      try {
        const result = await fetchProfile(userId);
        
        if (result.success && result.data) {
          const profileData = result.data;
          
          if (profileData.achievements && profileData.achievements.length > 0) {
            setIsSubmitted(true);
            const formattedAchievements = profileData.achievements.map((achievement: Achievement) => ({
              ...achievement,
              date: achievement.date?.split("T")[0] || ""
            }));
            form.reset({ achievements: formattedAchievements });
          }
        } else {
          setFetchError(result.error || "Failed to fetch achievements");
        }
      } catch (error) {
        console.error("Error loading achievements:", error);
        setFetchError("An unexpected error occurred while loading your achievements");
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, [userId, form]);

  const onSubmit: SubmitHandler<AchievementFormData> = async (data) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      const result = await updateAchievements(userId, data.achievements);
      
      if (result.success) {
        setIsSubmitted(true);
        onSuccess?.();
      } else {
        form.setError("root", {
          type: "manual",
          message: result.error || "Failed to update achievements"
        });
      }
    } catch (error) {
      console.error("Error submitting achievements:", error);
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addAchievement = () => {
    const current = form.getValues("achievements");
    form.setValue("achievements", [
      ...current,
      { title: "", description: "", date: "", issuer: "" }
    ]);
  };

  const removeAchievement = (index: number) => {
    const current = form.getValues("achievements");
    if (current.length > 1) {
      const updated = current.filter((_, i) => i !== index);
      form.setValue("achievements", updated);
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

  const achievements = form.watch("achievements") || [];

  return (
    <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
      {isSubmitted ? (
        <div className="space-y-4 text-lg">
          <h2 className="text-xl font-semibold text-[#0B60B0]">Achievements</h2>
          {achievements.length > 0 ? (
            achievements.map((achievement, index) => (
              <div key={index} className="border border-gray-200 p-3 rounded-lg">
                <p><strong>Title:</strong> {achievement.title}</p>
                <p><strong>Description:</strong> {achievement.description}</p>
                <p><strong>Date:</strong> {achievement.date}</p>
                <p><strong>Issuer:</strong> {achievement.issuer || "Not specified"}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No achievements added yet.</p>
          )}
          <Button 
            variant="outline" 
            className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
            onClick={() => setIsSubmitted(false)}
          >
            Edit Achievements
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <h2 className="text-xl font-semibold text-[#0B60B0]">Achievements</h2>
            <p className="text-gray-500 text-sm mb-4">Add details about awards, honors, or notable achievements that showcase your capabilities.</p>
            
            {achievements.map((_, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg space-y-3 relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  onClick={() => removeAchievement(index)}
                  disabled={achievements.length <= 1}
                >
                  <X size={20} />
                </button>
                <h3 className="text-lg font-medium">Achievement {index + 1}</h3>

                <FormField
                  control={form.control}
                  name={`achievements.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. First Prize in Hackathon" 
                          required 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`achievements.${index}.date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
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
                  name={`achievements.${index}.issuer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuer</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="e.g. Microsoft, ACM, University name" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`achievements.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe your achievement and its significance" 
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
                onClick={addAchievement}
                className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
              >
                Add Another Achievement
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
                  "Save Achievements"
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

export default AchievementInfo;