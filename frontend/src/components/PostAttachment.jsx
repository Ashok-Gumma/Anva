import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../lib/api";
import { FileText, ArrowRight, Sparkles, Image as ImageIcon } from "lucide-react";

const PostAttachment = ({ attachment }) => {
  const navigate = useNavigate();

  if (!attachment || attachment.type !== "post") return null;

  const postId = attachment.post_id;

  // If the attachment has an image or PDF but image/PDF data wasn't inlined to stay under StreamChat's 5KB limit,
  // fetch the post data dynamically and cache it with React Query.
  const shouldFetchDetails = Boolean(
    postId && (attachment.has_image || attachment.has_pdf) && !attachment.post_image
  );

  const { data: postDetails } = useQuery({
    queryKey: ["sharedPostDetails", postId],
    queryFn: () => getPostById(postId),
    enabled: shouldFetchDetails,
    staleTime: 5 * 60 * 1000,
  });

  const fullPost = postDetails?.post || null;

  const displayAuthorName =
    attachment.post_author_name || fullPost?.user?.fullName || "Community Member";
  const displayAuthorPic =
    fullPost?.user?.profilePic || attachment.post_author_pic || "/avatar.png";
  const displayCaption =
    attachment.post_caption || fullPost?.caption || "";
  const displayImage =
    attachment.post_image || fullPost?.image || null;
  const hasPdf =
    attachment.has_pdf || Boolean(fullPost?.pdfUrl);
  const pdfName =
    attachment.post_pdf_name || fullPost?.pdfFileName || "Study Notes.pdf";

  const handleOpenPost = (e) => {
    e.stopPropagation();
    if (postId) {
      navigate(`/feed#post-${postId}`);
    } else if (attachment.post_url) {
      window.open(attachment.post_url, "_blank");
    }
  };

  return (
    <div
      onClick={handleOpenPost}
      className="my-1.5 w-full max-w-[280px] sm:max-w-xs rounded-2xl overflow-hidden border border-base-content/15 bg-base-100 dark:bg-base-200 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer group text-base-content select-none"
    >
      {/* ── Instagram-Style Header ── */}
      <div className="flex items-center justify-between p-2.5 bg-base-200/70 dark:bg-base-300/40 border-b border-base-content/5">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={displayAuthorPic}
            alt={displayAuthorName}
            className="size-6 rounded-full object-cover border border-base-content/10 shrink-0"
          />
          <span className="text-xs font-bold truncate text-base-content">
            {displayAuthorName}
          </span>
        </div>
        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
          Post
        </span>
      </div>

      {/* ── Post Media Image Preview ── */}
      {displayImage ? (
        <div className="relative overflow-hidden max-h-48 bg-base-300">
          <img
            src={displayImage}
            alt="Post attachment"
            className="w-full h-full object-cover max-h-48 group-hover:scale-103 transition-transform duration-300"
          />
        </div>
      ) : shouldFetchDetails && attachment.has_image ? (
        <div className="h-36 bg-base-200 flex items-center justify-center text-base-content/40 animate-pulse">
          <ImageIcon className="size-6" />
        </div>
      ) : null}

      {/* ── Post PDF Document Preview ── */}
      {hasPdf && (
        <div className="p-2.5 bg-secondary/10 border-b border-secondary/15 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 bg-secondary text-secondary-content rounded-lg shrink-0">
              <FileText className="size-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold truncate text-base-content">
                {pdfName}
              </p>
              <span className="text-[8px] font-black uppercase text-secondary">
                Study Guide
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Post Caption ── */}
      {displayCaption && (
        <div className="p-2.5">
          <p className="text-xs text-base-content/85 line-clamp-3 font-medium leading-relaxed whitespace-pre-wrap">
            {displayCaption}
          </p>
        </div>
      )}

      {/* ── Bottom Call To Action ── */}
      <div className="px-3 py-2 bg-base-200/50 dark:bg-base-300/30 border-t border-base-content/5 flex items-center justify-between text-[10px] font-bold text-primary group-hover:text-primary-focus transition-colors">
        <span className="flex items-center gap-1">
          <Sparkles className="size-3" /> View on Feed
        </span>
        <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};

export default PostAttachment;
