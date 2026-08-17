// Top-level layout wrapper. No <Footer /> — the Stitch design uses the
// fixed mobile bottom nav in place of a traditional footer, and the
// desktop layout doesn't call for one either. Footer.jsx is left in the
// codebase unused in case a real footer gets added later (e.g. for the
// judge-facing marketing/landing page, if one gets built).

import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function AppShell() {
  return (
    <div className="font-body-md text-body-md antialiased pt-[72px] min-h-screen">
      <Navbar />
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg pb-24 md:pb-stack-lg">
        <Outlet />
      </main>
    </div>
  );
}