import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2 } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

const API_BASE_URL = "http://localhost:8000/api/profile";

function AchievementInfo({ formRef, onSuccess }) {
    const { user } = useAuthStore();
    const id = user?.userId;

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const form = useForm({
        defaultValues: {
            achievements: [{ title: "", description: "", date: "", issuer: "" }]
        }
    });

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!id) return;
            setIsLoading(true);
            setFetchError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/${id}/getprofile`);
                const profileData = response.data;

                if (profileData.achievements && profileData.achievements.length > 0) {
                    setIsSubmitted(true);
                    const formatted = profileData.achievements.map((a) => ({
                        ...a,
                        date: a.date?.split("T")[0] || ""
                    }));
                    form.reset({ achievements: formatted });
                }
            } catch (error) {
                console.error("Error fetching achievements:", error);
                setFetchError(error.response?.data?.error || "Failed to fetch achievements");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAchievements();
    }, [id, form]);

    const onSubmit = async (data) => {
        if (!id) return;
        try {
            const response = await axios.post(`${API_BASE_URL}/${id}/achievements`, {
                achievements: data.achievements
            });

            if (response.status === 200) {
                setIsSubmitted(true);
                onSuccess?.();
            }
        } catch (error) {
            console.error("Submission error:", error);
            form.setError("root", {
                type: "manual",
                message: error.response?.data?.error || "Failed to update achievements"
            });
        }
    };

    const addAchievement = () => {
        const current = form.getValues("achievements");
        form.setValue("achievements", [...current, { title: "", description: "", date: "", issuer: "" }]);
    };

    const removeAchievement = (index) => {
        const current = form.getValues("achievements");
        const updated = current.filter((_, i) => i !== index);
        form.setValue("achievements", updated);
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
                    <h2 className="text-xl font-semibold">Achievements</h2>
                    {achievements.map((a, index) => (
                        <div key={index} className="border p-3 rounded-lg">
                            <p><strong>Title:</strong> {a.title}</p>
                            <p><strong>Description:</strong> {a.description}</p>
                            <p><strong>Date:</strong> {a.date}</p>
                            <p><strong>Issuer:</strong> {a.issuer || "Not specified"}</p>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                        Edit
                    </Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {achievements.map((_, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-3 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                    onClick={() => removeAchievement(index)}
                                    disabled={achievements.length <= 1}
                                >
                                    <X size={20} />
                                </button>
                                <h3 className="text-lg font-semibold">Achievement {index + 1}</h3>

                                {["title", "date", "issuer"].map((field) => (
                                    <FormField
                                        key={field}
                                        control={form.control}
                                        name={`achievements.${index}.${field}`}
                                        render={({ field: f }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...f}
                                                        type={field === "date" ? "date" : "text"}
                                                        required={field !== "issuer"}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}

                                <FormField
                                    control={form.control}
                                    name={`achievements.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}

                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={addAchievement}>
                                Add Another Achievement
                            </Button>
                            <Button type="submit">Save</Button>
                        </div>

                        {form.formState.errors.root && (
                            <p className="text-red-500">{form.formState.errors.root.message}</p>
                        )}
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default AchievementInfo;
