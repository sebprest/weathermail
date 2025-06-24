"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDebounce } from "use-debounce";
import z from "zod/v4";
import { searchCity } from "@/lib/geosearch";
import { Spinner } from "@/components/ui/spinner";
import { subscriptionFormSchema } from "./validation";
import { createSubscription } from "./action";

export default function SubscriptionForm({ userId }: { userId: string }) {
  const form = useForm({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      location: {
        latitude: 0,
        longitude: 0,
        name: "",
      },
    },
  });
  const [locationSearch, setLocationSearch] = React.useState("");
  const [debouncedLocationSearch] = useDebounce(locationSearch, 500);
  const [locationOpen, setLocationOpen] = React.useState(false);
  const [locationSuggestions, setLocationSuggestions] = React.useState<
    { name: string; latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    searchCity(debouncedLocationSearch).then((locations) => {
      setLocationSuggestions(locations);
    });
  }, [debouncedLocationSearch]);

  function onSubmit({
    name,
    location,
  }: z.infer<typeof subscriptionFormSchema>) {
    createSubscription({ name, location });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="London" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={locationOpen}
                      className="justify-between"
                    >
                      {field.value.name
                        ? locationSuggestions.find(
                            (location) => location.name === field.value.name
                          )?.name
                        : "Select city..."}
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0 z-50">
                    <Command>
                      <CommandInput
                        placeholder="Search cities..."
                        onValueChange={setLocationSearch}
                      />
                      <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          {locationSuggestions.map((location) => (
                            <CommandItem
                              key={`${location.latitude},${location.longitude}`}
                              value={location.name}
                              onSelect={() => {
                                setLocationOpen(false);
                                field.onChange(location);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value.name === location.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {location.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Spinner /> : "Create Subscription"}
        </Button>
      </form>
    </Form>
  );
}
