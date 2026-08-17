function Navbar({ activePage, onNavigate }) {
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
    },
    {
      id: "impact",
      label: "Impact Analysis",
    },
    {
      id: "automations",
      label: "Automation Explorer",
    },
    {
      id: "health",
      label: "Dependency Health",
    },
  ];

  return (
    <nav className="main-navigation">
      <div className="navigation-inner">

        <div className="navigation-brand">
          <span className="navigation-logo">◆</span>

          <span>
            Workflow Debugger
          </span>
        </div>

        <div className="navigation-links">

          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                activePage === item.id
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;