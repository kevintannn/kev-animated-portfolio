import { createClient } from "@/prismicio";
import { PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import React from "react";
import NavBar from "./Navbar";

const Header = async () => {
  const client = createClient();
  const settings = await client.getSingle("settings");

  return (
    <header className="z-50 mx-auto max-w-7xl md:sticky md:top-4">
      <NavBar settings={settings} />
    </header>
  );
};

export default Header;
