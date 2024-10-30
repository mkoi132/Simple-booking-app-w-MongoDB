"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

//date picker function

export default function bookingForm() {
  const router = useRouter();
  //form schema
  const FormSchema = z.object({
    dateRange: z
      .object({
        from: z.date({ required_error: "Start date is required" }),
        to: z.date({ required_error: "End date is required" }),
      })
      .required()
      .refine(
        (date) => date.from >= new Date(new Date().setHours(0, 0, 0, 0)),
        {
          message: "End date cannot be in the past",
        }
      )
      .refine((date) => date.to >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Start date cannot be in the past",
      }),
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z
      .string()
      .min(10, { message: "Must be a valid mobile number" })
      .max(14, { message: "Must be a valid mobile number" }),
    postal_address: z
      .string()
      .min(1, { message: "Postal address is required" }),
    residential_address: z
      .string()
      .min(1, { message: "Residental address is required" }),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      dateRange: {
        from: new Date(),
        to: addDays(new Date(), 7),
      },
      name: "",
      email: "",
      phone: "",
      postal_address: "",
      residential_address: "",
    },
  });
  const pathname = usePathname();
  const _id = pathname.split("/").pop(); // Get the last part of the url path which is the listing id
  //submit handler
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    //do something with the values here to summit to the server
    // Append _id to the as prart of the values
    // values._id = _id;
    console.log(JSON.stringify(values));
    // Construct the URL using the current _id
    const url = `http://localhost:5000/listings/book/${_id}`;
    //Send the data to the server
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // Redirect to the success page
      if (response.ok) {
        const data = await response.json();


        router.push(
          `/booking/${_id}/success?message=${encodeURIComponent(
            data.message
          )}&booking_id=${encodeURIComponent(data.booking_id)}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });


  return (
    <div className="place-items-center p-5">
      <Card className="w-[48%] border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-xl">LET'S BOOK THIS PROPERTY</CardTitle>
          <CardDescription className="text-lg">Booking Details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="dateRange"
                    render={() => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="flex justify-end mb-0.5">
                          Pick dates for your stay
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                id="date"
                                variant={"outline"}
                                className={
                                  cn(
                                  " w-[auto] justify-end text-left font-normal",
                                  !date && "text-muted-foreground", " flex w-[50%] justify-end"
                                )}
                              >
                                <CalendarIcon />
                                {date?.from ? (
                                  date.to ? (
                                    <>
                                      {format(date.from, "LLL dd, y")} -{" "}
                                      {format(date.to, "LLL dd, y")}
                                    </>
                                  ) : (
                                    format(date.from, "LLL dd, y")
                                  )
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={date?.from}
                              selected={date}
                              onSelect={(selectedDate) => {
                                setDate(selectedDate);
                                form.setValue("dateRange", {
                                  from: selectedDate?.from ?? new Date(),
                                  to:
                                    selectedDate?.to ?? addDays(new Date(), 7),
                                });
                              }}
                              numberOfMonths={2}
                              disabled={(date) => date < new Date("1900-01-01")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            placeholder="Enter your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email Address</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="Enter your email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            id="phone"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postal_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Address</FormLabel>
                        <FormControl>
                          <Input
                            id="postal_address"
                            placeholder="Enter your postal address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="residential_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residental Address</FormLabel>
                        <FormControl>
                          <Input
                            id="residential_address"
                            placeholder="Enter your residental address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <CardFooter className="flex justify-start pl-0 mt-6 space-x-3">
                <Button variant="outline">
                  <Link href={"/"}>Cancel</Link>
                </Button>
                <Button type="submit">Book</Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
