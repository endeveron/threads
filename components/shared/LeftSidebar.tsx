import MainMenuLinks from '@/components/shared/MainMenuLinks';
import SignOutButton from '@/components/shared/SignOutButton';

interface LeftSidebarProps {}

const LeftSidebar = (props: LeftSidebarProps) => {
  return (
    <section className="left-sidebar custom-scrollbar">
      <div className="left-sidebar_main">
        <MainMenuLinks />
      </div>
      <div className="left-sidebar_bottom mt-10">
        <SignOutButton
          className="main-menu_link"
          callbackRoute="/"
          label="Logout"
        />
      </div>
    </section>
  );
};

export default LeftSidebar;
