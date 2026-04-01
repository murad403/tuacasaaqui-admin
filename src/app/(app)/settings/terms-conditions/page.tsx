"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/shared/RichTextEditor";
import Link from "next/link";
import { ArrowLeft, CheckCheck, SquarePen } from "lucide-react";
import { useGetPrivacyQuery, useUpdatePrivacyMutation } from "@/redux/features/settings/settings.api";
import { toast } from "react-toastify";

export default function PrivacyExplanationPage() {
    const { data: pageData, isLoading } = useGetPrivacyQuery("terms_conditions");
    const [updatePrivacy, { isLoading: isSaving }] = useUpdatePrivacyMutation();
    const [draftContent, setDraftContent] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);

    const content = draftContent ?? pageData?.content ?? "";

    const handleEditOrSave = async () => {
        if (!editing) {
            setEditing(true);
            return;
        }

        try {
            await updatePrivacy({
                pageType: "terms_conditions",
                data: {
                    content,
                    meta_title: pageData?.meta_title || "",
                    meta_description: pageData?.meta_description || "",
                },
            }).unwrap();

            toast.success("Terms and conditions updated successfully.");
            setEditing(false);
            setDraftContent(null);
        } catch (error: unknown) {
            const message =
                typeof error === "object" &&
                    error !== null &&
                    "data" in error &&
                    typeof (error as { data?: { message?: string; detail?: string } }).data === "object"
                    ? (error as { data?: { message?: string; detail?: string } }).data?.message ||
                    (error as { data?: { message?: string; detail?: string } }).data?.detail ||
                    "Failed to update terms and conditions."
                    : "Failed to update terms and conditions.";

            toast.error(message);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Link href={"/settings"} className="cursor-pointer">
                    <ArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-medium text-title">Terms and Conditions</h1>
                    <p className="text-description text-sm">Terms Of Service explanation outlines how we collect, use, and protect your personal information.</p>
                </div>
            </div>
            <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4 gap-4">
                    <h1 className="text-2xl md:text-3xl font-semibold text-title whitespace-nowrap">Terms And Conditions</h1>
                    <Button
                        onClick={handleEditOrSave}
                        disabled={isSaving}
                        className="max-w-25"
                    >

                        {isSaving ? "Saving..." : editing ?
                            <span className="flex items-center gap-3 justify-center">
                                <CheckCheck  className="size-4 text-white"/>
                                Save</span> :
                            <span className="flex items-center gap-3 justify-center">
                                <SquarePen className="size-4 text-white" /> Edit
                            </span>}
                    </Button>
                </div>
                {isLoading && !draftContent ? (
                    <p className="text-sm text-description">Loading content...</p>
                ) : null}
                {editing ? (
                    <RichTextEditor content={content} onChange={setDraftContent} />
                ) : (
                    <div
                        className="prose prose-sm max-w-none [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-medium [&_ul]:list-disc [&_ul]:pl-6"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                )}
            </div>
        </div>
    );
}
