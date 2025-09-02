'use client';

import { logout } from "@/lib/actions";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useTransition } from "react";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        startTransition(() => {
            logout();
        });
    }

    return (
        <form action={logout}>
             <Button type="submit" variant="outline" disabled={isPending}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </form>
    );
}
