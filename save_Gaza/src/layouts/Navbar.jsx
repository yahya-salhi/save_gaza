import { NavLink } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import Logo from "../components/Logo";
import Button from "../shared/ui/Button";
import { useTheme, THEMES } from "../shared/providers/ThemeProvider";
import { NAV_ITEMS } from "./navItems";

function navLinkClass({ isActive }) {
  return `px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
    isActive ? "text-brand-crimson" : "text-light-2 hover:text-brand-crimson"
  }`;
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEMES.DARK;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background-dark/95 backdrop-blur supports-[backdrop-filter]:bg-background-dark/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={toggleTheme}
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
            className="rounded-full p-2 text-light-2 hover:text-brand-crimson"
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </Button>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Button
                type="button"
                aria-label="Open navigation menu"
                className="rounded-full p-2 text-light-2 hover:text-brand-crimson md:hidden"
              >
                <Menu size={24} />
              </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
              <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-card p-6 shadow-xl">
                <Dialog.Title className="sr-only">Navigation menu</Dialog.Title>
                <div className="flex items-center justify-between">
                  <Logo />
                  <Dialog.Close asChild>
                    <Button
                      type="button"
                      aria-label="Close navigation menu"
                      className="rounded-full p-2 text-light-2 hover:text-brand-crimson"
                    >
                      <X size={24} />
                    </Button>
                  </Dialog.Close>
                </div>
                <ul className="mt-8 flex flex-col gap-2">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.to}>
                      <Dialog.Close asChild>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `${navLinkClass({ isActive })} block w-full`
                          }
                        >
                          {item.label}
                        </NavLink>
                      </Dialog.Close>
                    </li>
                  ))}
                </ul>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </nav>
    </header>
  );
}
