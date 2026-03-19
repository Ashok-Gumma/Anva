import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, updatePassword } from "../lib/api";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { CameraIcon, SaveIcon } from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [previewImage, setPreviewImage] = useState(authUser?.profilePic || "");
  const [base64Image, setBase64Image] = useState(null);

  const [githubUrl, setGithubUrl] = useState(authUser?.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(authUser?.linkedinUrl || "");
  const [nativeLanguage, setNativeLanguage] = useState(authUser?.nativeLanguage || "");
  const [learningLanguage, setLearningLanguage] = useState(authUser?.learningLanguage || "");

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
    if (nativeLanguage !== authUser?.nativeLanguage) payload.nativeLanguage = nativeLanguage;
    if (learningLanguage !== authUser?.learningLanguage) payload.learningLanguage = learningLanguage;

    if (Object.keys(payload).length === 0) return toast.info("No changes made.");
    updateProfileMutation(payload);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-base-100 rounded-[2rem] shadow-xl border border-base-content/10 w-full max-w-lg p-8 sm:p-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">Profile Settings</h1>
          <p className="text-base-content/60 font-medium">Update your avatar and personal details</p>
        </div>

        {/* Avatar Upload UI */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative size-32 sm:size-36 rounded-2xl border border-base-content/10 bg-primary overflow-hidden flex items-center justify-center shadow-md group">
            {/* Fallback Text */}
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-primary-content opacity-90">
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

          <p className="text-xs text-base-content/40 font-medium max-w-xs text-center mt-2">
            Upload a squared image. Supported formats: JPG, PNG, WEBP.
          </p>
        </div>

        {/* User Stats Display (Read-Only) */}
        <div className="space-y-4 bg-base-200 p-5 rounded-2xl border border-base-content/10 shadow-sm">
          <div className="flex items-center justify-between border-b border-base-content/10 pb-3">
            <span className="text-base-content/60 text-sm font-semibold">Full Name</span>
            <span className="font-bold text-base-content tracking-tight text-right">{authUser?.fullName}</span>
          </div>
          <div className="flex items-center justify-between border-b border-base-content/10 pb-3">
            <span className="text-base-content/60 text-sm font-semibold">Email</span>
            <span className="font-bold text-base-content tracking-tight text-right text-sm">{authUser?.email}</span>
          </div>
          <div className="flex items-center justify-between border-b border-base-content/10 pb-3">
            <span className="text-base-content/60 text-sm font-semibold">Location</span>
            <span className="font-bold text-base-content tracking-tight text-right">{authUser?.location || "Not Set"}</span>
          </div>
          <div className="flex items-center justify-between flex-wrap pt-1">
            <span className="text-base-content/60 text-sm font-semibold">Language</span>
            <div className="flex gap-2 text-xs mt-1">
              <span className="px-3 py-1 bg-secondary/10 text-secondary font-bold rounded-lg border border-secondary/20">{authUser?.nativeLanguage || "Not Configured"}</span>
              <span className="px-3 py-1 bg-accent/10 text-accent font-bold rounded-lg border border-accent/20">Learning {authUser?.learningLanguage || "None"}</span>
            </div>
          </div>
        </div>

        {/* Languages Selection */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-sm font-semibold text-base-content/80 ml-1">Native Language</label>
              <select
                className="w-full px-4 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium appearance-auto cursor-pointer"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
              >
                <option value="" disabled>Select your known language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Russian">Russian</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Arabic">Arabic</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
            
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <label className="text-sm font-semibold text-base-content/80 ml-1">Learning Language</label>
              <select
                className="w-full px-4 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium appearance-auto cursor-pointer"
                value={learningLanguage}
                onChange={(e) => setLearningLanguage(e.target.value)}
              >
                <option value="" disabled>Select language to learn</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Russian">Russian</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Arabic">Arabic</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Social Links Form */}
        <div className="space-y-4">
          <div className="space-y-1.5 flex flex-col items-start">
            <label className="text-sm font-semibold text-base-content/80 ml-1">GitHub Profile URL</label>
            <input
              type="url"
              placeholder="https://github.com/username"
              className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-base-content/40 font-medium"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 flex flex-col items-start">
            <label className="text-sm font-semibold text-base-content/80 ml-1">LinkedIn Profile URL</label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              className="w-full px-5 py-3.5 bg-base-200 text-base-content border border-base-content/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-base-content/40 font-medium"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Change Password Section */}
        <div className="pt-6 border-t border-base-content/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base-content tracking-tight text-lg">Security Settings</h3>
            <button 
              onClick={() => setIsEditingPassword(!isEditingPassword)}
              className="px-4 py-2 text-sm font-medium text-base-content bg-base-200 hover:bg-base-300 rounded-xl transition-colors"
            >
              {isEditingPassword ? "Cancel" : "Change Password"}
            </button>
          </div>

          {isEditingPassword && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              onSubmit={handlePasswordSubmit} 
              className="space-y-4 bg-base-200 p-6 rounded-2xl border border-base-content/10 mt-2"
            >
              <div className="space-y-1.5 flex flex-col items-start">
                <label className="text-sm font-semibold text-base-content/80 ml-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-base-100 text-base-content border border-base-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                />
              </div>
              <div className="space-y-1.5 flex flex-col items-start">
                <label className="text-sm font-semibold text-base-content/80 ml-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-3 bg-base-100 text-base-content border border-base-content/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary text-primary-content font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition-all flex items-center justify-center mt-2"
                disabled={isPasswordPending}
              >
                {isPasswordPending ? <span className="w-4 h-4 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin"></span> : "Update Password"}
              </button>
            </motion.form>
          )}
        </div>

        <button
          onClick={handeSave}
          disabled={isPending}
          className="w-full bg-primary text-primary-content font-semibold py-4 rounded-xl shadow-md hover:opacity-90 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-4"
        >
          {isPending ? (
             <span className="w-5 h-5 border-2 border-primary-content/30 border-t-primary-content rounded-full animate-spin"></span>
          ) : (
            <>
              <SaveIcon className="size-5" />
              Save Profile Changes
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
