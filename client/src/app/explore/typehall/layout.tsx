"use client";
import Loading from "@/components/loading";
import { WpmRecord } from "@/types";
import axios from "axios";
import { useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";

const TypeHallLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <nav className="flex flex-col gap-10">
        <h1 className="text-5xl font-JetBrainsMono text-[#ffffffb4]">
          Typehall
        </h1>
        <section className="flex items-center gap-4 w-fit">
          <Link
            href={"/explore/typehall?sort=highest"}
            className="font-Aspekta flex items-center gap-1 text-sm text-white bg-glass p-2 rounded-md"
          >
            <img className="size-6" src="/svgs/highest.svg" alt="" />
            Highest WPM
          </Link>
          <Link
            href={"/explore/typehall?sort=lowest"}
            className="font-Aspekta flex items-center gap-1 text-sm text-white bg-glass p-2 rounded-md"
          >
            <img className="size-6" src="/svgs/lowest.svg" alt="" />
            Lowest WPM
          </Link>
          <Link
            href={"/explore/typehall?sort=newest"}
            className="font-Aspekta flex items-center gap-1 text-sm text-white bg-glass p-2 rounded-md"
          >
            <img className="size-6" src="/svgs/new.svg" alt="" />
            Newest WPM
          </Link>
          <Link
            href={"/explore/typehall?sort=oldest"}
            className="font-Aspekta flex items-center gap-1 text-sm text-white bg-glass p-2 rounded-md"
          >
            <img className="size-6" src="/svgs/old.svg" alt="" />
            Oldest WPM
          </Link>
        </section>
      </nav>
      {children}
    </div>
  );
};

export default TypeHallLayout;
