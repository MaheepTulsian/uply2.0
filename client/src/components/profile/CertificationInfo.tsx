import React, { useState, useEffect, RefObject } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Loader2, FileBadge } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { fetchProfile, updateCertifications } from "@/utils/ProfileApi";

interface Certification {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expirationDate?: string;
  credentialId: string;
  credentialURL?: string;
}

interface CertificationFormData {
  certifications: Certification[];
}

interface CertificationInfoProps {
  formRef?: RefObject<HTMLFormElement>;
  onSuccess?: () => void;
}

const CertificationInfo: React.FC<CertificationInfoProps> = ({ formRef, onSuccess }) => {
  const { user } = useAuthStore();
  const userId = user?.userId;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<CertificationFormData>({
    defaultValues: {
      certifications: [{
        name: "",
        issuingOrganization: "",
        issueDate: "",
        expirationDate: "",
        credentialId: "",
        credentialURL: "",
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certifications"
  });

  useEffect(() => {
    const loadCertifications = async () => {
      if (!userId) return;
      setIsLoading(true);
      setFetchError(null);

      try {
        const result = await fetchProfile(userId);
        
        if (result.success && result.data) {
          const profileData = result.data;
          
          if (profileData.certifications?.length) {
            setIsSubmitted(true);
            const formattedCerts = profileData.certifications.map((cert: Certification) => ({
              ...cert,
              issueDate: cert.issueDate?.split("T")[0] || "",
              expirationDate: cert.expirationDate?.split("T")[0] || ""
            }));
            form.reset({ certifications: formattedCerts });
          }
        } else {
          setFetchError(result.error || "Failed to fetch certifications");
        }
      } catch (error) {
        console.error("Error loading certifications:", error);
        setFetchError("An unexpected error occurred while loading your certifications");
      } finally {
        setIsLoading(false);
      }
    };

    loadCertifications();
  }, [userId, form]);

  const onSubmit: SubmitHandler<CertificationFormData> = async (data) => {
    if (!userId) return;
    
    setIsLoading(true);
    
    try {
      const result = await updateCertifications(userId, data.certifications);
      
      if (result.success) {
        setIsSubmitted(true);
        onSuccess?.();
      } else {
        form.setError("root", {
          type: "manual",
          message: result.error || "Failed to update certifications"
        });
      }
    } catch (error) {
      console.error("Error submitting certifications:", error);
      form.setError("root", {
        type: "manual",
        message: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCertification = () => {
    append({
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialId: "",
      credentialURL: ""
    });
  };

  const removeCertification = (index: number) => {
    if (fields.length > 1) {
      remove(index);
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

  const certifications = form.watch("certifications") || [];

  return (
    <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
      {isSubmitted ? (
        <div className="space-y-4 text-lg">
          <div className="flex items-center gap-2">
            <FileBadge className="h-6 w-6 text-[#0B60B0]" />
            <h2 className="text-xl font-semibold text-[#0B60B0]">Certifications</h2>
          </div>
          
          {certifications.length > 0 ? (
            certifications.map((cert, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-lg">{cert.name}</h3>
                <p className="text-[#0B60B0] font-medium">{cert.issuingOrganization}</p>
                <p className="text-sm text-gray-500">
                  Issued: {cert.issueDate}
                  {cert.expirationDate && <span> · Expires: {cert.expirationDate}</span>}
                </p>
                <p className="text-sm"><span className="font-medium">Credential ID:</span> {cert.credentialId}</p>
                {cert.credentialURL && (
                  <p className="text-sm">
                    <a
                      href={cert.credentialURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0B60B0] hover:underline"
                    >
                      Verify Credential
                    </a>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No certifications added yet.</p>
          )}
          
          <Button 
            variant="outline" 
            className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
            onClick={() => setIsSubmitted(false)}
          >
            Edit Certifications
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex items-center gap-2">
              <FileBadge className="h-6 w-6 text-[#0B60B0]" />
              <h2 className="text-xl font-semibold text-[#0B60B0]">Certifications</h2>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Add your professional certifications to highlight your expertise and credentials.
            </p>
            
            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 p-4 rounded-lg space-y-3 relative">
                <button
                  type="button"
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                  onClick={() => removeCertification(index)}
                  disabled={fields.length <= 1}
                >
                  <X size={20} />
                </button>
                <h3 className="text-lg font-medium">Certification {index + 1}</h3>

                <FormField
                  control={form.control}
                  name={`certifications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. AWS Certified Solutions Architect"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`certifications.${index}.issuingOrganization`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuing Organization</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Amazon Web Services"
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
                    name={`certifications.${index}.issueDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Date</FormLabel>
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
                    name={`certifications.${index}.expirationDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiration Date (if any)</FormLabel>
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
                  name={`certifications.${index}.credentialId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credential ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. ABC123XYZ"
                          required
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`certifications.${index}.credentialURL`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credential URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://example.com/verify"
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
                onClick={addCertification}
                className="border-[#0B60B0] text-[#0B60B0] hover:bg-[#0B60B0] hover:text-white"
              >
                Add Another Certification
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
                  "Save Certifications"
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

export default CertificationInfo;