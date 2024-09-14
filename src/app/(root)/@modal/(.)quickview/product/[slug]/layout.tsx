import {
  AlertDialogContent,
  AlertDialog,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogTitle>модал за преглед на продукта</AlertDialogTitle>
      <AlertDialogContent
        aria-describedby="..."
        className="max-w-2xl min-w-xl max-h-[500px] overflow-x-auto"
      >
        {props.children}
      </AlertDialogContent>
    </AlertDialog>
  );
}
