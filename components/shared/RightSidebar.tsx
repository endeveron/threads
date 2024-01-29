import SuggestedCommunities from '@/components/shared/SuggestedCommunities';
import SuggestedUsers from '@/components/shared/SuggestedUsers';

interface RightSidebarProps {}

const RightSidebar = (props: RightSidebarProps) => {
  return (
    <section className="right-sidebar custom-scrollbar">
      <div className="right-sidebar_content-box">
        <h3 className="right-sidebar_title">Suggested Communities</h3>
        <SuggestedCommunities />
      </div>
      <div className="right-sidebar_content-box">
        <h3 className="right-sidebar_title">Suggested Users</h3>
        <SuggestedUsers />
      </div>
    </section>
  );
};

export default RightSidebar;
