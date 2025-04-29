import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  resume: string;
}

const PersonalInfo = ({ formRef, onSuccess }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const API_BASE_URL = "http://localhost:8000/api";

  // Initialize the form with default values
  const form = useForm<PersonalInfoForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
      resume: "",
    },
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.userId) return;
      
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/${user.userId}/getprofile`, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        const profileData = response.data;
        
        // Check if personal info exists
        if (profileData.personalInfo) {
          setIsSubmitted(true);
          
          // Format the data before setting it in the form
          form.reset({
            firstName: profileData.personalInfo.firstName || "",
            lastName: profileData.personalInfo.lastName || "",
            email: profileData.personalInfo.email || "",
            phone: profileData.personalInfo.phone || "",
            dateOfBirth: profileData.personalInfo.dateOfBirth?.split('T')[0] || "",
            address: {
              street: profileData.personalInfo.address?.street || "",
              city: profileData.personalInfo.address?.city || "",
              state: profileData.personalInfo.address?.state || "",
              country: profileData.personalInfo.address?.country || "",
              zipCode: profileData.personalInfo.address?.zipCode || "",
            },
            resume: profileData.personalInfo.resume || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user, form]);

  // Handle form submission
  const onSubmit = async (formData: PersonalInfoForm) => {
    if (!user?.userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/profile/${user.userId}/personal_info`, 
        formData,
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
      const errorMessage = err.response?.data?.detail || "Failed to update personal information. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
        <div className="space-y-6 text-lg">
          <h2 className="text-2xl font-bold text-[#0B60B0]">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-500 text-sm">Full Name</h3>
              <p>{form.getValues("firstName")} {form.getValues("lastName")}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-500 text-sm">Email</h3>
              <p>{form.getValues("email")}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-500 text-sm">Phone</h3>
              <p>{form.getValues("phone")}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-gray-500 text-sm">Date of Birth</h3>
              <p>{form.getValues("dateOfBirth")}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-gray-500 text-sm">Address</h3>
            <p>
              {form.getValues("address.street")}, {form.getValues("address.city")}, {form.getValues("address.state")}, {form.getValues("address.country")} {form.getValues("address.zipCode")}
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-gray-500 text-sm">Resume Link</h3>
            <p className="text-[#0B60B0] hover:underline">
              <a href={form.getValues("resume")} target="_blank" rel="noopener noreferrer">
                {form.getValues("resume") || "No resume link provided"}
              </a>
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
            onClick={() => setIsSubmitted(false)}
          >
            Edit Information
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-bold text-[#0B60B0]">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <h3 className="font-medium">Address</h3>
              
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your state/province" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address.zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip/Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your zip/postal code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume Link</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="Enter link to your resume" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                {error}
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
                "Save Information"
              )}
            </Button>
          </form>
        </Form>
      )}
    </Card>
  );
};

export default PersonalInfo;