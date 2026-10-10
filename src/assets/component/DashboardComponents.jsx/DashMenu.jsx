import SidebarNav from './SidebarNav';

// Desktop sidebar: fills its column and stays in view below the sticky header (69px: 4px accent + 64px bar + 1px border)
function DashMenu() {
  return (
    <aside className="sticky top-[69px] hidden h-[calc(100vh-69px)] w-full overflow-y-auto bg-linear-to-b from-[#06660b] via-[#055b08] to-[#044a07] [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin] lg:block">
      <SidebarNav />
    </aside>
  );
}

export default DashMenu;
