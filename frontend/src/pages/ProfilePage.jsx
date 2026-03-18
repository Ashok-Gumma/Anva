import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, updatePassword } from "../lib/api";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { CameraIcon, SaveIcon } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [previewImage, setPreviewImage] = useState(authUser?.profilePic || "");
  const [base64Image, setBase64Image] = useState(null);

  const [githubUrl, setGithubUrl] = useState(authUser?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(authUser?.linkedinUrl || "");

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  // Mutation for updating password
  const { mutate: changePasswordMutation, isPending: isPasswordPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setIsEditingPassword(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to change password");
    },
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    changePasswordMutation({ currentPassword, newPassword });
  };

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
    const payload = {};
    if (base64Image) payload.profilePic = base64Image;
    if (githubUrl !== authUser?.githubUrl) payload.githubUrl = githubUrl;
    if (linkedinUrl !== authUser?.linkedinUrl) payload.linkedinUrl = linkedinUrl;

    if (Object.keys(payload).length === 0) return toast.info("No changes made.");
    updateProfileMutation(payload);
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

        {/* Social Links Form */}
        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">GitHub Profile URL</span>
            </label>
            <input
              type="url"
              placeholder="https://github.com/username"
              className="input input-bordered"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">LinkedIn Profile URL</span>
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              className="input input-bordered"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="pt-2 border-t border-base-content/10">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold opacity-80">Security</h3>
            <button 
              onClick={() => setIsEditingPassword(!isEditingPassword)}
              className="btn btn-sm btn-ghost text-xs"
            >
              {isEditingPassword ? "Cancel" : "Change Password"}
            </button>
          </div>

          {isEditingPassword && (
            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 bg-base-200/50 p-4 rounded-xl border border-base-content/10">
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">Current Password</span></label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input input-sm input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text text-sm">New Password</span></label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-sm input-bordered"
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-sm w-full"
                disabled={isPasswordPending}
              >
                {isPasswordPending ? <span className="loading loading-spinner loading-xs"></span> : "Update Password"}
              </button>
            </form>
          )}
        </div>

        <button
          onClick={handeSave}
          disabled={isPending}
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
