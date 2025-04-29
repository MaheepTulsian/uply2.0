import React, { useState, useEffect, RefObject } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Globe, 
  Linkedin, 
  Github, 
  Twitter, 
  MessagesSquare, 
  Code, 
  Loader2, 
  Link as LinkIcon 
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { fetchProfile, updateSocialLinks } from "@/utils/ProfileApi";

interface Socials {
  linkedIn: string;
  github: string;
  twitter: string;
  website: string;
  medium: string;
  stackOverflow: string;
  leetcode: string;
}

interface SocialFormValues {
  linkedIn: string;
  github: string;
  twitter: string;
  website: string;
  medium: string;
  stackOverflow: string;
  leetcode: string;
}

interface SocialInfoProps {
  formRef?: RefObject<HTMLFormElement>;
  onSuccess?: () => void;
}

const socialPlatforms = {
  linkedIn: { label: "LinkedIn", icon: <Linkedin className="w-5 h-5 text-blue-600" /> },
  github: { label: "GitHub", icon: <Github className="w-5 h-5 text-gray-700" /> },
  twitter: { label: "Twitter", icon: <Twitter className="w-5 h-5 text-blue-500" /> },
  website: { label: "Website", icon: <Globe className="w-5 h-5 text-green-600" /> },
  medium: { label: "Medium", icon: <MessagesSquare className="w-5 h-5 text-black" /> },
  stackOverflow: { label: "Stack Overflow", icon: <Code className="w-5 h-5 text-orange-500" /> },
  leetcode: { label: "LeetCode", icon: <Code className="w-5 h-5 text-yellow-600" /> },
};

const SocialInfo: React.FC<SocialInfoProps> = ({ formRef, onSuccess }) => {
  const { user } = useAuthStore();
  const userId = user?.userId;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<SocialFormValues>({
    defaultValues: {
      linkedIn: "",
      github: "",
      twitter: "",
      website: "",
      medium: "",
      stackOverflow: "",
      leetcode: "",
    }
  });

  useEffect(() => {
    const loadSocials = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      setFetchError(null);
      
      try {
        const result = await fetchProfile(userId);
        
        if (result.success && result.data) {
          const profileData = result.data;
          
          if (profileData.socials) {
            setIsSubmitted(true);
            
            // Initialize with default values and merge with fetched data
            const defaultSocials = {
              linkedIn: "",
              github: "",
              twitter: "",
              website: "",
              medium: "",
              stackOverflow: "",
              leetcode: "",
            };
            
            form.reset({
              ...defaultSocials,
              ...profileData.socials
            });
          }
        } else {
          setFetchError(result.error || "Failed to fetch social links");
        }
      } catch (error) {
        console.error("Error loading social links:", error);
        setFetchError("An unexpected error occurred while loading your social links");
      } finally {
        setIsLoading(false);
      }
    };

    loadSocials();
  }, [userId, form]);

  const onSubmit: SubmitHandler<SocialFormValues> = async (data) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      // Filter out empty values before submitting
      const socialsToSubmit = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value.trim() !== "")
      );
      
      // Validate URLs
      const validateUrl = (url: string) => {
        if (!url) return url;
        return url.startsWith('http://') || url.startsWith('https://') 
          ? url 
          : `https://${url}`;
      };
      
      // Format URLs
      const formattedSocials = Object.fromEntries(
        Object.entries(socialsToSubmit).map(([key, value]) => [key, validateUrl(value)])
      );
      
      const result = await updateSocialLinks(userId, formattedSocials);
      
      if (result.success) {
        setIsSubmitted(true);
        onSuccess?.();
      } else {
        form.setError("root", {
          type: "manual",
          message: result.error || "Failed to update social links"
        });
      }
    } catch (error) {
      console.error("Error submitting social links:", error);
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentSocials = form.watch();

  if (isLoading) {
    return (
      <Card className="p-6 w-full max-w-3xl bg-background border-none shadow-none flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0B60B0]" />
      </Card>
    );
  }

  if (fetchError) {
    return (
      <Card className="p-6 w-full max-w-3xl bg-background border-none shadow-none">
        <div className="text-red-500">{fetchError}</div>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </Card>
    );
  }

  // Count how many social links are filled
  const filledSocialsCount = Object.values(currentSocials).filter(val => val && val.trim() !== '').length;

  return (
    <Card className="p-6 w-full max-w-3xl bg-background border-none shadow-none">
      {isSubmitted ? (
        <div className="space-y-4 text-lg">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-6 w-6 text-[#0B60B0]" />
            <h2 className="text-xl font-semibold text-[#0B60B0]">Social Links</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(currentSocials)
              .filter(([_, value]) => value && value.trim() !== "")
              .map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2 border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  {socialPlatforms[key]?.icon || <LinkIcon className="w-5 h-5 text-gray-500" />}
                  <a
                    href={value.startsWith('http') ? value : `https://${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B60B0] hover:underline truncate"
                  >
                    {socialPlatforms[key]?.label || key}
                  </a>
                </div>
              ))
            }
          </div>
          
          {filledSocialsCount === 0 && (
            <p className="text-gray-500">No social links added yet.</p>
          )}
          
          <Button 
            variant="outline" 
            className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
            onClick={() => setIsSubmitted(false)}
          >
            Edit Social Links
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-6 w-6 text-[#0B60B0]" />
              <h2 className="text-xl font-semibold text-[#0B60B0]">Social Links</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Add your social media profiles and online presence to help others connect with you.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(socialPlatforms).map(([key, { label, icon }]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof SocialFormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        {icon}
                        <span>{label}</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={`e.g. ${key === "website" ? "yourwebsite.com" : `${key}.com/username`}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            
            {form.formState.errors.root && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {form.formState.errors.root.message}
              </div>
            )}
            
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
                "Save Social Links"
              )}
            </Button>
          </form>
        </Form>
      )}
    </Card>
  );
};

export default SocialInfo;