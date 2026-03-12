"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const defaultContent = `
<h2>1. Introduction</h2>
<p>Form-Cert SRL ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform and use our services.</p>
<h2>2. Information We Collect</h2>
<h3>Personal Data</h3>
<p>We may collect personally identifiable information, such as:</p>
<ul>
<li>Name and contact information (email address, phone number)</li>
<li>Professional information (job title, company, industry)</li>
<li>Account credentials (username, password)</li>
<li>Payment information (processed securely through third-party payment processors)</li>
<li>Course enrollment and progress data</li>
</ul>
<h3>3.Usage Data</h3>
<p>We automatically collect information about your device and how you interact with our platform, including IP address, browser type, pages visited, time spent on pages, and other diagnostic data.</p>
<h2>4. Data Security</h2>
<p>We implement appropriate technical and organizational security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
<h2>5. Data Retention</h2>
<p>We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.</p>
<h2>6. Your Rights and Choices</h2>
<p>You can update your account information, unsubscribe from marketing communications, or request deletion of your data by contacting us at privacy@form-cert.eu.</p>
<h2>7. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>`;

export default function DataSourceDisclaimerPage() {
    const [content, setContent] = useState(defaultContent);
    const [editing, setEditing] = useState(false);

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
                        onClick={() => setEditing(!editing)}
                        className="max-w-xs"
                    >
                        {editing ? "Save" : "Edit"}
                    </Button>
                </div>
                {editing ? (
                    <RichTextEditor content={content} onChange={setContent} />
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
