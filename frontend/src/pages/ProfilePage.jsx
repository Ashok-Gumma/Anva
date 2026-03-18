import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { CameraIcon, SaveIcon } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [previewImage, setPreviewImage] = useState(authUser?.profilePic || "");
  const [base64Image, setBase64Image] = useState(null);

  // Mutation for updating profile
  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      // update cached user
      queryClient.setQueryData(["authUser"], { user: updatedUser });
      toast.success("Profile updated successfully!");
      setBase64Image(null);
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.1, // Compress to ~100KB to fit easily in MongoDB and base64 strings
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      // Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setBase64Image(reader.result); // base 64 string to be passed
      };
    } catch (error) {
      console.error("Image compression error:", error);
      toast.error("Failed to process image.");
    }
  };

  const handeSave = () => {
    if (!base64Image) return toast.error("Please select a new image first.");
    updateProfileMutation({ profilePic: base64Image });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card glass-panel w-full max-w-lg p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="opacity-70">Update your avatar and personal details</p>
        </div>

        {/* Avatar Upload UI */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative size-32 sm:size-40 rounded-full border-4 border-base-content/20 bg-primary/10 overflow-hidden flex items-center justify-center shadow-lg group">
            {/* Fallback Text */}
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold opacity-30">
              {authUser?.fullName?.charAt(0).toUpperCase()}
            </span>

            {/* Profile Picture */}
            {(previewImage || authUser?.profilePic) && (
              <img
                src={previewImage || authUser?.profilePic}
                alt="Profile Avatar"
                className="absolute inset-0 w-full h-full object-cover z-10"
              />
            )}

            {/* Overlay */}
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 z-20 bg-black/50 text-white flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
            >
              <CameraIcon className="size-8 mb-1" />
              <span className="text-sm font-semibold">Change Photo</span>
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <p className="text-xs opacity-60 max-w-xs text-center">
            Upload a squared image. Supported formats: JPG, PNG, WEBP.
          </p>
        </div>

        {/* User Stats Display (Read-Only) */}
        <div className="space-y-4 bg-base-200/50 p-4 rounded-xl border border-base-content/5">
          <div className="flex items-center justify-between border-b border-base-content/10 pb-2">
            <span className="opacity-70 text-sm font-semibold">Full Name</span>
            <span className="font-medium text-right">{authUser?.fullName}</span>
          </div>
          <div className="flex items-center justify-between border-b border-base-content/10 pb-2">
            <span className="opacity-70 text-sm font-semibold">Email</span>
            <span className="font-medium text-right text-sm">{authUser?.email}</span>
          </div>
          <div className="flex items-center justify-between border-b border-base-content/10 pb-2">
            <span className="opacity-70 text-sm font-semibold">Location</span>
            <span className="font-medium text-right">{authUser?.location || "Not Set"}</span>
          </div>
          <div className="flex items-center justify-between flex-wrap">
            <span className="opacity-70 text-sm font-semibold">Language</span>
            <div className="flex gap-2 text-xs mt-1">
              <span className="badge badge-secondary p-2">{authUser?.nativeLanguage || "None"}</span>
              <span className="badge badge-outline p-2">Learning {authUser?.learningLanguage || "None"}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handeSave}
          disabled={!base64Image || isPending}
          className="btn btn-primary w-full shadow-lg h-12 text-lg disabled:opacity-50"
        >
          {isPending ? (
            <span className="loading loading-spinner" />
          ) : (
            <>
              <SaveIcon className="size-5 mr-2" />
              Save Profile
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
