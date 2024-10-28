"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,

} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// Function to fetch data from the API
// async function fetchData() {
//   const res = await fetch("http://localhost:5000");
//   const data = await res.json();
//   return data;
// }

const PropertyTypes = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export default function Home() {
  // const res = await fetch("http://localhost:5000");
  // let data = await res.json();
  // console.log(data);

  // 1. Define form.
  const FormSchema = z.object({
    Location: z.string().min(3, {
      message: "Location is required.",
    }),
    Bedrooms: z.string().optional(),
    PropertyType: z.string().optional(),
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      Location: "",
      Bedrooms: "",
      PropertyType: "",
    },
  });
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof FormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("Form errors:", form.formState.errors); // Check for errors
    console.log("Form Submitted with values:", values);
  }
  // Clear function to reset the form
  const clearForm = () => {
    form.reset({
      Location: "",
      Bedrooms: "",
      PropertyType: "",
    });
    setValue("");
  };
  //popover select
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return (
    <>
      <div className="flex flex-row h-screen">
        <div className="h-[full] w-[30%] rounded-sm border p-5">
          <Card className="w-[full] border-0 shadow-none">
            <CardHeader>
              <CardTitle>Find Property</CardTitle>
              <CardDescription>
                Pick from over 5000 destinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid w-full items-center gap-4">
                    {/* ----------------------------------//location field */}
                    <div className="flex flex-col space-y-1.5">
                      {/* Location Field */}
                      <FormField
                        control={form.control}
                        name="Location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input
                                id="Location"
                                placeholder="Enter a destination"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* --------------------------//bedroom field */}
                    <div className="flex flex-col space-y-1.5 text-pretty">
                      <FormField
                        control={form.control}
                        name="Bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <SelectTrigger id="Bedrooms">
                                <SelectValue placeholder="Select number of bedroom" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* ------------------- //property field */}
                    <div className="flex flex-col space-y-1.5">
                      <FormField
                        control={form.control}
                        name="PropertyType"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1.5">
                            <FormLabel>Property Type</FormLabel>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={open}
                                  className="w-[full] justify-between"
                                >
                                  {value
                                    ? PropertyTypes.find(
                                        (PropertyType) =>
                                          PropertyType.value === value
                                      )?.label
                                    : "Select a type"}
                                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50 w-[full]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[full] p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search a type"
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      No PropertyType found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {PropertyTypes.map((PropertyType) => (
                                        <CommandItem
                                          key={PropertyType.value}
                                          value={PropertyType.value}
                                          onSelect={(currentValue) => {
                                            field.onChange(currentValue); // Update form state
                                            setValue(
                                              currentValue === field.value
                                                ? ""
                                                : currentValue
                                            ); // Update local state
                                            setOpen(false);
                                          }}
                                        >
                                          {PropertyType.label}
                                          <CheckIcon
                                            className={cn(
                                              "ml-auto h-4 w-4",
                                              value === PropertyType.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* -------------------- */}
                  </div>
                  <CardFooter className="flex justify-start pl-0 mt-6 space-x-3">
                    <Button variant="outline" onClick={clearForm}>
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      className="bg-slate-950 hover:bg-slate-700"
                    >
                      Find
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <ScrollArea className="h-[auto] w-[70%] rounded-sm border p-10">
          Jokester began sneaking into the castle in the middle of the night and
          leaving jokes all over the place: under the king's pillow, in his
          soup, even in the royal toilet. The king was furious, but he couldn't
          seem to stop Jokester. And then, one day, the people of the kingdom
          discovered that the jokes left by Jokester were so funny that they
          couldn't help but laugh. And once they started laughing, they couldn't
          stop.
        </ScrollArea>
      </div>
    </>
  );
}
