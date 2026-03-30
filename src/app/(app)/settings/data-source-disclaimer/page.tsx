"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGetPrivacyQuery, useUpdatePrivacyMutation } from "@/redux/features/settings/settings.api";
import { toast } from "react-toastify";

export default function DataSourceDisclaimerPage() {
    const { data: pageData, isLoading } = useGetPrivacyQuery("disclaimer");
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
                pageType: "disclaimer",
                data: {
                    content,
                    meta_title: pageData?.meta_title || "",
                    meta_description: pageData?.meta_description || "",
                },
            }).unwrap();

            toast.success("Disclaimer updated successfully.");
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
                    "Failed to update disclaimer."
                    : "Failed to update disclaimer.";

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
                    <h1 className="text-2xl font-medium text-title">Data Source Disclaimer</h1>
                    <p className="text-description text-sm">This disclaimer outlines the sources and limitations of the data used on our platform.</p>
                </div>
            </div>
            <div className="bg-white rounded-xl border p-6">
                <div className="flex items-center justify-between mb-4 gap-4">
                    <h1 className="text-2xl md:text-3xl font-semibold text-title whitespace-nowrap">Data source disclaimer</h1>
                    <Button
                        onClick={handleEditOrSave}
                        disabled={isSaving}
                        className="max-w-xs"
                    >
                        {isSaving ? "Saving..." : editing ? "Save" : "Edit"}
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
