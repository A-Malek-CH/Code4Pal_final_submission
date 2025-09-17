"use client";

import Image from "next/image";
import Link from "next/link";

import { Mail, Calendar, ShieldCheck, ShieldAlert } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UserMap from "@/components/core/UserMap";

export default function page() {

  const user = {
    name: "MANAA Mohaned",
    email: "lives@gmail.com",
    avatar: "/imgs/user.JPG",
    joinedAt: "2024-01-15T00:00:00.000Z",
    accountStatus: "Active" as const,
    reportCount: 0,
    verificationDocument: "/imgs/user.JPG",
    verificationStatus: "Verified" as const,
  };

  const joinedFmt = new Date(user.joinedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isActive = user.accountStatus === "Active";
  const isVerified = user.verificationStatus === "Verified";

  const badge = (ok: boolean, okColor = "emerald") =>
    `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${ok
      ? `bg-${okColor}-50 text-${okColor}-700 ring-${okColor}-200`
      : "bg-red-50 text-red-700 ring-red-200"
    }`;

  return (
    <main className="full flex flex-col space-y-8 -pt-4 pb-4">

      {/* Header / Identity */}
      <section className="relative overflow-hidden rounded-b-2xl border-b bg-white/60 shadow-sm min-h-max">

        <div className="h-16 w-full bg-gradient-to-b from-emerald-500 to-emerald-300" />

        <div className="-mt-12 px-6 p-6 flex flex-col gap-4 sm:flex-row sm:items-end">

          <div className="shrink-0">
            <div className="h-24 w-24 rounded-full ring-4 ring-gray-700 overflow-hidden bg-white shadow-md">
              <Image src={user.avatar} alt={user.name} width={96} height={96} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex-1 mt-8">
            <h1 className="text-2xl font-semibold leading-tight">{user.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Joined {joinedFmt}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-8">
            <span className={badge(isActive) + " text-white bg-emerald-500"}>
              {isActive ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
              Account: {user.accountStatus}
            </span>
            <span className={badge(isVerified, "sky") + " text-white bg-emerald-500"}>
              {isVerified ? <ShieldCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
              Verification: {user.verificationStatus}
            </span>
          </div>

        </div>
      </section>

      {/* Details */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 px-4 flex-grow">

        {/* Left */}
        <div className="rounded-xl border bg-white/60 p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-500">Profile</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{user.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Joined</span>
              <span className="font-medium">{joinedFmt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Number of Reports</span>
              <span className="font-medium">{user.reportCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Verification Document</span>
              <Link href={user.verificationDocument} className="font-medium text-emerald-700 underline">{user.verificationDocument}</Link>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="rounded-xl border bg-white/60 p-5 shadow-sm">
          <Tabs defaultValue="markers" className="full">

            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="markers">Markers</TabsTrigger>
              <TabsTrigger value="sos">SOS</TabsTrigger>
            </TabsList>

            <TabsContent value="markers">
              <UserMap map="markers" />
            </TabsContent>

            <TabsContent value="sos">
              <UserMap map="sos" />
            </TabsContent>

          </Tabs>
        </div>

      </section>
    </main>
  );
};
