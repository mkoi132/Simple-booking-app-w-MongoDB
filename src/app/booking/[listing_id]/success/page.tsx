"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const message = useSearchParams().get("message");
  const booking_id = useSearchParams().get("booking_id");
  const router = useRouter();
  if (!message || !booking_id) {
    return router.back();
  }
  return (
    <div className="place-items-center place-content-center items-center">
      <Card className="w-[50%] h-[50%] place-items-center border-none place-content-center m-20">
        <CardHeader>
          <CardTitle className="text-center text-lg">{message}!</CardTitle>
          <CardDescription className="text-center">
            Here is your booking ID, keep it somewhere accessible
          </CardDescription>
        </CardHeader>
        <CardContent>
            <strong className="text-2xl text-center">{booking_id}</strong>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button>
            <Link href={"/"}>Back to listings index</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
