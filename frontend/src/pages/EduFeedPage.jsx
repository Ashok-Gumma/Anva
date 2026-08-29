import CommunityFeedSection from "../components/CommunityFeedSection";

const EduFeedPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <CommunityFeedSection showCreatePost={true} />
    </div>
  );
};

export default EduFeedPage;
