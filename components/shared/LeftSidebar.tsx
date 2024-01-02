import MainMenuLinks from '@/components/shared/MainMenuLinks';
import SignOutButton from '@/components/shared/SignOutButton';

interface LeftSidebarProps {}

const LeftSidebar = (props: LeftSidebarProps) => {
  return (
    <section className="left-sidebar custom-scrollbar">
      <div className="left-sidebar_container">
        <MainMenuLinks />
      </div>
      <div className="mt-10 px-6">
        <SignOutButton callbackRoute="/sign-in" label="Logout" />
      </div>
    </section>
  );
};

export default LeftSidebar;
