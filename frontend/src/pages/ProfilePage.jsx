import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUserProfile } from "../lib/api";
import {
  Camera,
  Upload,
  Shuffle,
  Loader,
  Save,
  X,
} from "lucide-react";
import { LANGUAGES } from "../constants";
import imageCompression from "browser-image-compression"; // ✅ added

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    profilePic: authUser?.profilePic || "",
    location: authUser?.location || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    linkedin: authUser?.linkedin || "",
    github: authUser?.github || "",
    education: {
      school: authUser?.education?.school || "",
      degree: authUser?.education?.degree || "",
      fieldOfStudy: authUser?.education?.fieldOfStudy || "",
    },
    skills: authUser?.skills || [],
  });

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (authUser) {
      setFormState({
        fullName: authUser.fullName || "",
        bio: authUser.bio || "",
        profilePic: authUser.profilePic || "",
        location: authUser.location || "",
        nativeLanguage: authUser.nativeLanguage || "",
        learningLanguage: authUser.learningLanguage || "",
        linkedin: authUser.linkedin || "",
        github: authUser.github || "",
        education: {
          school: authUser.education?.school || "",
          degree: authUser.education?.degree || "",
          fieldOfStudy: authUser.education?.fieldOfStudy || "",
        },
        skills: authUser.skills || [],
      });
    }
  }, [authUser]);

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  // ✅ UPDATED IMAGE UPLOAD WITH COMPRESSION
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
        toast.success("Image uploaded!");
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error(error);
      toast.error("Image compression failed");
    }
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState((prev) => ({ ...prev, profilePic: randomAvatar }));
    toast.success("Random avatar generated!");
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formState.skills.includes(skillInput.trim())) {
      setFormState((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormState((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileMutation(formState);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormState({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      profilePic: authUser?.profilePic || "",
      location: authUser?.location || "",
      nativeLanguage: authUser?.nativeLanguage || "",
      learningLanguage: authUser?.learningLanguage || "",
      linkedin: authUser?.linkedin || "",
      github: authUser?.github || "",
      education: {
        school: authUser?.education?.school || "",
        degree: authUser?.education?.degree || "",
        fieldOfStudy: authUser?.education?.fieldOfStudy || "",
      },
      skills: authUser?.skills || [],
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body p-6 sm:p-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary btn-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="space-y-6">

                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <div className="size-40 rounded-full bg-base-300 overflow-hidden">
                    {formState.profilePic ? (
                      <img src={formState.profilePic} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera className="size-16 opacity-40" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">{formState.fullName}</h2>
                    <p>{formState.bio}</p>
                  </div>
                </div>

              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="flex flex-col items-center gap-4">
                  <div className="size-40 rounded-full overflow-hidden">
                    {formState.profilePic ? (
                      <img src={formState.profilePic} className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="size-16 opacity-40" />
                    )}
                  </div>

                  <label className="btn btn-outline btn-sm">
                    <Upload className="size-4 mr-1" />
                    Upload
                    <input type="file" hidden onChange={handleImageUpload} />
                  </label>

                  <button type="button" onClick={handleRandomAvatar} className="btn btn-accent btn-sm">
                    <Shuffle className="size-4 mr-1" />
                    Random
                  </button>
                </div>

                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={handleCancel} className="btn btn-outline">
                    <X className="mr-2" /> Cancel
                  </button>

                  <button type="submit" className="btn btn-primary">
                    {isPending ? (
                      <>
                        <Loader className="animate-spin mr-2" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" /> Save
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;