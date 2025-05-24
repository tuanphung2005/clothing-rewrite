'use client'

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Input } from "@heroui/input";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import clsx from "clsx";
import { link as linkStyles } from "@heroui/theme";

import { Auth } from "@/components/navBar/Auth";
import { Cart } from "@/components/navBar/Cart";
import { useAuth } from "@/lib/auth-context";

export const Navbar = () => {
  const { user } = useAuth();

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      startContent={
        <Icon icon="mdi:magnify" />
      }
      labelPlacement="outside"
      placeholder="Search..."
      type="search"
    />
  );

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <p className="font-bold text-inherit">GIOHOA</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          {user && (
            <NavbarItem>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                href="/account"
              >
                Quản lý tài khoản
              </NextLink>
            </NavbarItem>
          )}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden lg:flex gap-2">
          {searchInput}
          <Cart />
          <Auth />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Cart />
        <Auth />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {searchInput}
          {user && (
            <NextLink
              href="/account"
              className="block px-2 py-2 text-foreground hover:text-primary"
            >
              Quản lý tài khoản
            </NextLink>
          )}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
