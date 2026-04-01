"use client";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema, type ArticleFormData } from "@/validation/article.validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ImagePlus, X, ArrowLeft } from "lucide-react";
import RichTextEditor from "@/components/shared/RichTextEditor";
import Link from "next/link";
import { useGetNewsCategoriesQuery } from "@/redux/features/news/news.api";

interface ArticleFormProps {
    defaultValues?: Partial<ArticleFormData>;
    onSubmit: (data: ArticleFormData) => void;
    isEditing?: boolean;
    isLoading?: boolean;
}

export default function ArticleForm({
    defaultValues,
    onSubmit,
    isEditing = false,
    isLoading = false,
}: ArticleFormProps) {
    const { data: categories = [] } = useGetNewsCategoriesQuery();

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<ArticleFormData>({
        resolver: zodResolver(articleSchema),
        defaultValues: {
            title: "",
            content: "",
            category: 0,
            location: "",
            image: "",
            is_featured: false,
            is_published: true,
            ...defaultValues,
        },
    });

    const watchedValues = useWatch({ control });

    const previewContent = (watchedValues.content || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const selectedCategoryName =
        categories.find((category) => category.id === watchedValues.category)?.name || "";

    const imagePreview = (() => {
        const imageValue = watchedValues.image;
        if (!imageValue) return "";
        if (typeof imageValue === "string") return imageValue;
        return URL.createObjectURL(imageValue);
    })();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("image", file, { shouldValidate: true });
        }
    };

    const removeImage = () => {
        setValue("image", "", { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link href="/news-management">
                    <button type="button" className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <ArrowLeft className="size-5 text-gray-600" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-title">
                        {isEditing ? "Edit News" : "Create News"}
                    </h1>
                    <p className="text-sm text-description mt-0.5">
                        {isEditing
                            ? "Update the article details below"
                            : "Write and publish a news article for your app's homepage"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Upload */}
                    <div className="bg-white rounded-xl border p-6">
                        <Label className="text-base font-medium text-title mb-3 block">
                            Cover Image
                        </Label>
                    {imagePreview ? (
                        <div className="relative rounded-lg overflow-hidden border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imagePreview}
                                alt="Article preview"
                                className="w-full h-64 object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm transition-colors"
                            >
                                <X className="size-4 text-gray-600" />
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                            <ImagePlus className="size-10 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 font-medium">
                                Click to upload
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                                PNG, JPG up to 10MB
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    )}
                    {typeof errors.image?.message === "string" && (
                        <p className="text-sm text-red-500 mt-2">{errors.image.message}</p>
                    )}
                </div>

                {/* Title */}
                <div className="bg-white rounded-xl border p-6">
                    <Label htmlFor="title" className="text-base font-medium text-title mb-2 block">
                        Article Title
                    </Label>
                    <Input
                        id="title"
                        placeholder="Enter a compelling title..."

                        {...register("title")}
                        className={cn(errors.title && "border-red-500 w-full")}
                    />
                    {errors.title && (
                        <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                    )}
                </div>

                {/* Content - Rich Text Editor */}
                <div className="bg-white rounded-xl border p-6">
                    <Label className="text-base font-medium text-title mb-2 block">
                        Article Content <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                            <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.content && (
                        <p className="text-sm text-red-500 mt-1">{errors.content.message}</p>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Publishing Options */}
                <div className="bg-white rounded-xl border p-6 space-y-5">
                    <h2 className="text-base font-semibold text-title">Publishing Options</h2>

                    {/* Category */}
                    <div>
                        <Label className="text-base font-medium text-title mb-2 block">
                            Category
                        </Label>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={String(field.value || "")}
                                    onValueChange={(value) => field.onChange(Number(value))}
                                >
                                    <SelectTrigger className={cn("w-full", errors.category && "border-red-500")}>
                                        <SelectValue placeholder="Select category" className="capitalize" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={String(category.id)} className="capitalize">
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category && (
                            <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div>
                        <Label htmlFor="location" className="text-base font-medium text-title mb-2 block">
                            Location
                        </Label>
                        <Input
                            id="location"
                            placeholder="Enter location"
                            {...register("location")}
                            className={cn(errors.location && "border-red-500")}
                        />
                        {errors.location && (
                            <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Label className="text-base font-medium text-title block">Visibility</Label>
                        <label className="flex items-center gap-2 text-sm text-title cursor-pointer select-none">
                            <input
                                type="checkbox"
                                {...register("is_published")}
                                className="size-4 rounded border-gray-300 text-button-start focus:ring-button-start"
                            />
                            Published
                        </label>
                        <label className="flex items-center gap-2 text-sm text-title cursor-pointer select-none">
                            <input
                                type="checkbox"
                                {...register("is_featured")}
                                className="size-4 rounded border-gray-300 text-button-start focus:ring-button-start"
                            />
                            Featured
                        </label>
                    </div>


                </div>

                {/* Inline Article Preview */}
                <div className="bg-white rounded-xl border p-6">
                    <h2 className="text-base font-semibold text-title mb-4">Article Preview</h2>
                    <div className="rounded-lg border overflow-hidden">
                        {imagePreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-36 object-cover"
                            />
                        ) : (
                            <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                                <span className="text-sm text-gray-400">Cover Image Preview</span>
                            </div>
                        )}
                        <div className="p-3 space-y-1">
                            <p className="font-semibold text-sm text-title line-clamp-2">
                                {watchedValues.title || "Article title will appear here"}
                            </p>
                            <p className="text-xs text-description line-clamp-2">
                                {previewContent || "Article description will appear here"}
                            </p>
                            {typeof watchedValues.category === "number" && watchedValues.category > 0 && (
                                <Badge variant="secondary" className="text-xs mt-1 capitalize">
                                    Category: {selectedCategoryName || "Unknown"}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-linear-to-r from-button-start to-button-end text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Publishing..." : (isEditing ? "Update Article" : "Publish Article")}
                </Button>
            </div>
        </div>
    </form>
    );
}
