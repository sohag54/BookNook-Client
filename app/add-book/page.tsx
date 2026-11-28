"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api-client";
import toast from "react-hot-toast";
import {
  PlusCircle,
  BookOpen,
  User,
  Mail,
  Layers,
  FileText,
  Image as ImageIcon,
  Hash,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Upload,
  X,
} from "lucide-react";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();
  const user = sessionData?.user;

  // Form State
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState("1");

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic Page Title
  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  // Revoke object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Private route protection
  useEffect(() => {
    if (!isPending && !user) {
      toast.error("Please log in to add a new book to the library.");
      router.push(`/login?callbackUrl=${encodeURIComponent("/add-book")}`);
    }
  }, [isPending, user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type (JPEG, PNG, WebP)
    const validMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validMimeTypes.includes(file.type)) {
      const msg = "Invalid file type. Please select a JPEG, PNG, or WebP image.";
      setFormError(msg);
      toast.error(msg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      const msg = "Image file size exceeds the 5MB limit. Please choose a smaller image.";
      setFormError(msg);
      toast.error(msg);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Form Validations
    if (!title.trim()) {
      const msg = "Book title is required.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (!author.trim()) {
      const msg = "Author name is required.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (uploadMode === "file") {
      if (!selectedFile) {
        const msg = "Please select a book cover image from your device.";
        setFormError(msg);
        toast.error(msg);
        return;
      }
    } else {
      if (!image.trim()) {
        const msg = "Book cover image URL is required.";
        setFormError(msg);
        toast.error(msg);
        return;
      }
    }

    if (!description.trim()) {
      const msg = "Short description is required.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    const numCopies = parseInt(copies, 10);
    if (isNaN(numCopies) || numCopies < 0) {
      const msg = "Total copies must be a non-negative number.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("author", author.trim());
      formData.append("category", category);
      formData.append("description", description.trim());
      formData.append("copies", numCopies.toString());
      formData.append("userName", user?.name || "Anonymous Reader");
      formData.append("userEmail", user?.email || "");

      if (uploadMode === "file" && selectedFile) {
        formData.append("image", selectedFile);
      } else {
        formData.append("image", image.trim());
      }

      const response = await apiFetch<any>("/books", {
        method: "POST",
        body: formData,
      });

      if (response.error) {
        setFormError(response.error);
        toast.error(response.error);
        setIsLoading(false);
        return;
      }

      toast.success("Book added successfully to the library catalog!");
      // Redirect to My Books page
      router.push("/my-books");
    } catch (err: any) {
      const msg = err?.message || "An unexpected error occurred while adding the book.";
      setFormError(msg);
      toast.error(msg);
      setIsLoading(false);
    }
  };

  // While checking session hydration, show centered spinner
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-zinc-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="w-full min-h-screen py-10 sm:py-16 bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/my-books"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to My Books</span>
          </Link>
        </div>

        {/* Form Container Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-8 sm:p-12">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
              <PlusCircle className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Add a New Book
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Contribute to the BookNook online catalog by sharing a book from your collection.
            </p>
          </div>

          {/* Form Error Banner */}
          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
              {formError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Book Title & Author Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Book Title *
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sapiens"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Author Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Yuval Noah Harari"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 2. Category & Total Copies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Category *
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isLoading}
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Total Available Copies *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="number"
                    min="0"
                    value={copies}
                    onChange={(e) => setCopies(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 3. Book Cover Image Selection & Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Book Cover Image *
                </label>
                {/* Mode Selector Toggle */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode("file");
                      setFormError(null);
                    }}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      uploadMode === "file"
                        ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode("url");
                      setFormError(null);
                    }}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      uploadMode === "url"
                        ? "bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {uploadMode === "file" ? (
                /* File Upload Area */
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className="hidden"
                    id="book-cover-file"
                  />

                  {!selectedFile ? (
                    /* Dropzone / Upload Button when no file is selected */
                    <label
                      htmlFor="book-cover-file"
                      className="group flex flex-col items-center justify-center w-full p-6 sm:p-8 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-zinc-50 dark:bg-zinc-800/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Choose a Book Cover Image
                      </span>
                      <p className="text-xs text-zinc-500 mt-1">
                        Select a JPEG, PNG, or WebP image from your device (Max 5MB)
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        Browse Computer
                      </span>
                    </label>
                  ) : (
                    /* Selected File Details & Instant Preview */
                    <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {previewUrl && (
                          <div className="relative w-16 h-22 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-700 flex-shrink-0 shadow-sm border border-zinc-200 dark:border-zinc-700">
                            {/* Standard img tag for local blob URLs */}
                            <img
                              src={previewUrl}
                              alt="Book cover preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; {selectedFile.type || "Image"}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Ready to upload to ImgBB</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isLoading}
                          className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
                        >
                          Replace
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          disabled={isLoading}
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback Manual URL Input */
                <div>
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://i.ibb.co/example/book-cover.jpg"
                      required={uploadMode === "url"}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                  {image.trim().startsWith("http") && (
                    <div className="mt-3 flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                      <div className="relative w-12 h-16 rounded overflow-hidden bg-zinc-200 flex-shrink-0">
                        <img
                          src={image}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs text-zinc-500 truncate">
                        Image URL preview loaded successfully.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 4. Short Description */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Short Description *
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a brief synopsis of the book's story, topics, or key takeaways..."
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* 5. User Details (Read-only from logged in user per PDF) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  User Name (Read-Only)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={user.name || "BookNook Member"}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-sm cursor-not-allowed select-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  User Email (Read-Only)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-sm cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Adding Book & Uploading Cover...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Add Book</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

