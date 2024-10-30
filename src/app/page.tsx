"use client";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Skeleton } from "@/components/ui/skeleton";

// Type for listing items
interface Listing {
  _id: string;
  name: string;
  summary: string;
  address: {
    market: string;
  };
  property_type: string;
  bedrooms: number;
  review_scores: {
    review_scores_rating: number;
  };
}
async function fetchData(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}



export default function Home() {
  // State to store fetched data
  const [listings, setListings] = useState<Listing[]>([]);
  const [bedroomOptions, setBedroomOptions] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<[]>([]);
  // loading state that trigger the skeleton loader
  const [loading, setLoading] = useState(true);
  //identify a search result so we can display different
  const [isSearchResult, setIsSearchResult] = useState(false);

  // // Fetch data to client side
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [listingsData, bedroomData, propertyData] = await Promise.all([
          fetchData("http://localhost:5000/listings"),
          fetchData("http://localhost:5000/listings/filter/bedroom"),
          fetchData("http://localhost:5000/listings/filter/property_type"),
        ]);
        //set the data to the state
        setListings(listingsData);
        setBedroomOptions(bedroomData);
        setPropertyTypes(propertyData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Map values to use with drop down
  const mappedPropertyTypes = propertyTypes.map((type) => ({
    value: type,
    label: type, // same text for label
  }));
  const mappedBedroomOptions = bedroomOptions.map((option) => ({
    value: option,
    label: option, // same text for label
  }));

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
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    // ✅ Submit the form data to the server  and update the listings'
    setLoading(true); // enter loading
    setIsSearchResult(true); //this is a search result
    try {
      // Construct the URL with query parameters based on form values
      const queryString = new URLSearchParams(
        values as Record<string, string>
      ).toString();
      const response = await fetch(
        `http://localhost:5000/listings/find?${queryString}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setListings(data); // Update listings with fetched data to refresh scrollable area

      console.log("Form Submitted with values:", values);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // exit loading state
    }
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
  //popover select search
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // Display the skeleton loader while loading
  const LoadingSkeleton = () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[auto] w-[full] rounded-xl" />
      <div className="space-y-2">
        <h1>Just a moment . . .</h1>
        <Skeleton className="h-8 w-[full]" />
        <Skeleton className="h-6 w-[60%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-8 w-[full]" />
        <Skeleton className="h-5 w-[30%]" />
        <Skeleton className="h-8 w-[70%]" />
        <Skeleton className="h-8 w-[50%]" />
        <Skeleton className="h-5 w-[full]" />
        <Skeleton className="h-8 w-[full]" />
        <Skeleton className="h-6 w-[60%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-8 w-[full]" />
        <Skeleton className="h-5 w-[30%]" />
        <Skeleton className="h-8 w-[70%]" />
        <Skeleton className="h-8 w-[50%]" />
        <Skeleton className="h-5 w-[full]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-8 w-[full]" />
      </div>
    </div>
  );
  // router
  const router = useRouter();
  // Display search results as cards
  const ListingCards = () => (
    <>
      {isSearchResult && (
        <h1 className="pb-3 text-lg sticky top-0 w-full bg-white">
          <strong>Your search returned {listings.length} results</strong>
        </h1>
      )}
      {listings.map((listing) => (
        <Card key={listing._id} className="h-[auto] w-[full] mb-3">
          <CardHeader>
            <CardTitle>
              <span
                onClick={() => router.push(`/booking/${listing._id}`)}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                {listing.name}
              </span>
            </CardTitle>
            <CardDescription>
              {listing.summary || `Property in ${listing.address.market}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <strong>Location:</strong> {listing.address.market || "n/a"}{" "}
              <br />
              <strong>Property type:</strong> {listing.property_type || "n/a"}{" "}
              <br />
              <strong>Number of bedrooms:</strong> {listing.bedrooms || "n/a"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm">
              <strong>Review Score:</strong>{" "}
              {listing.review_scores.review_scores_rating || "Not yet rated"}
            </p>
          </CardFooter>
        </Card>
      ))}
    </>
  );

  // ui render
  return (
    <>
      <div className="flex flex-row h-screen">
        <div className="h-[full] w-[30%] rounded-sm  border-t-0  pt-3 pb-4 pl-5 pr-5">
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
                                placeholder="Search..."
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
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                {mappedBedroomOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value.toString()}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
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
                                    ? mappedPropertyTypes.find(
                                        (propertyType) =>
                                          propertyType.value === value
                                      )?.label
                                    : "Select"}
                                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50 w-[full]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[full] p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search a Property Type"
                                    className="h-9"
                                  />
                                  <CommandList>
                                    <CommandEmpty>
                                      No PropertyType found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {mappedPropertyTypes.map((type) => (
                                        <CommandItem
                                          key={type.value}
                                          value={type.value}
                                          onSelect={(currentValue) => {
                                            field.onChange(currentValue);
                                            setValue(
                                              currentValue === field.value
                                                ? ""
                                                : currentValue
                                            );
                                            setOpen(false);
                                          }}
                                        >
                                          {type.label}
                                          <CheckIcon
                                            className={cn(
                                              "ml-auto h-4 w-4",
                                              value === type.value
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
        <Separator
          orientation="vertical"
          className=" h-[70%]  self-center"
        />
        <ScrollArea className="h-[auto] w-[70%] rounded-sm border-t-0 p-10">
          {loading ? (
            <LoadingSkeleton />
          ) : listings.length > 0 ? (
            <ListingCards />
          ) : (
            <div className="flex flex-col space-y-3">
              <h1>
                <strong>Uh, Oh! No results found</strong>
              </h1>
              <p>
                Try changing your search criteria or{" "}
                <a
                  href="http://localhost:3000"
                  className="text-blue-600 hover:underline"
                >
                  view all listings
                </a>
              </p>
              <p className="text-red-500">
                TIPS: Location field is Case-Sensitive
              </p>
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
