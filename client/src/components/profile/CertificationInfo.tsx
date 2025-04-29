import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import axios from "axios";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Loader2 } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

type Certification = {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId: string;
    credentialURL?: string;
};

type FormData = {
    certifications: Certification[];
};

interface CertificationInfoProps {
    formRef?: React.RefObject<HTMLFormElement>;
    onSuccess?: () => void;
}

const CertificationInfo: React.FC<CertificationInfoProps> = ({ formRef, onSuccess }) => {
    const { user } = useAuthStore();
    const id = user?.userId;

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const API_BASE_URL = "http://localhost:8000/api/profile";

    const form = useForm<FormData>({
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
        const fetchCertifications = async () => {
            if (!id) return;
            setIsLoading(true);
            setFetchError(null);

            try {
                const response = await axios.get(`${API_BASE_URL}/${id}/getprofile`);
                const profileData = response.data;

                if (profileData.certifications?.length) {
                    setIsSubmitted(true);
                    const formattedCerts = profileData.certifications.map((cert: Certification) => ({
                        ...cert,
                        issueDate: cert.issueDate?.split("T")[0] || "",
                        expirationDate: cert.expirationDate?.split("T")[0] || ""
                    }));
                    form.reset({ certifications: formattedCerts });
                }
            } catch (error: any) {
                console.error("Error fetching certifications:", error);
                setFetchError(error.response?.data?.error || "Failed to fetch certifications");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCertifications();
    }, [id, form]);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/${id}/certifications`, {
                certifications: data.certifications
            });

            if (response.status === 200) {
                setIsSubmitted(true);
                onSuccess?.();
            }
        } catch (error: any) {
            console.error("Submission error:", error);
            const errorMessage = error.response?.data?.error || "Failed to update certifications";
            form.setError("root", { type: "manual", message: errorMessage });
        }
    };

    if (isLoading) {
        return (
            <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </Card>
        );
    }

    if (fetchError) {
        return (
            <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
                <div className="text-red-500">{fetchError}</div>
                <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
            </Card>
        );
    }

    return (
        <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <h2 className="text-xl font-semibold">Certifications</h2>
                    {form.watch("certifications")?.map((cert, index) => (
                        <div key={index} className="border p-3 rounded-lg">
                            <p><strong>Name:</strong> {cert.name}</p>
                            <p><strong>Issuing Organization:</strong> {cert.issuingOrganization}</p>
                            <p><strong>Issue Date:</strong> {cert.issueDate}</p>
                            <p><strong>Expiration Date:</strong> {cert.expirationDate || 'No expiration'}</p>
                            <p><strong>Credential ID:</strong> {cert.credentialId}</p>
                            <p>
                                <strong>Credential URL:</strong>
                                {cert.credentialURL ? (
                                    <a href={cert.credentialURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-2">
                                        {cert.credentialURL}
                                    </a>
                                ) : 'Not provided'}
                            </p>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {fields.map((field, index) => (
                            <div key={field.id} className="border p-4 rounded-lg space-y-3 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                    onClick={() => remove(index)}
                                    disabled={fields.length <= 1}
                                >
                                    <X size={20} />
                                </button>
                                <h3 className="text-lg font-semibold">Certification {index + 1}</h3>

                                {["name", "issuingOrganization", "issueDate", "expirationDate", "credentialId", "credentialURL"].map((key) => (
                                    <FormField
                                        key={key}
                                        control={form.control}
                                        name={`certifications.${index}.${key}` as const}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type={key.includes("Date") ? "date" : "text"}
                                                        required={key !== "expirationDate" && key !== "credentialURL"}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                            </div>
                        ))}
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={() =>
                                append({
                                    name: "",
                                    issuingOrganization: "",
                                    issueDate: "",
                                    expirationDate: "",
                                    credentialId: "",
                                    credentialURL: ""
                                })
                            }>
                                Add Another Certification
                            </Button>
                            <Button type="submit">Save Certifications</Button>
                        </div>

                        {form.formState.errors.root && (
                            <p className="text-red-500">{form.formState.errors.root.message}</p>
                        )}
                    </form>
                </Form>
            )}
        </Card>
    );
};

export default CertificationInfo;
