import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOut } from "@/lib/actions/user.actions";

export default async function UserButton() {
  const session = await auth();
  if (!session || !session.user)
    return (
      <Link href="/api/auth/signin">
        <Button>Sign In</Button>
      </Link>
    );
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button variant="ghost" className="relative h-8 ml-2 w-full">
              {session.user.name}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/profile">
              Профил
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link className="w-full" href="/user/orders">
              История на поръчките
            </Link>
          </DropdownMenuItem>

          {session.user.role === "admin" && (
            <DropdownMenuItem>
              <Link className="w-full" href="/admin/overview">
                Админ
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0 mb-1">
            <form action={SignOut} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant="ghost"
              >
                Излез
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
