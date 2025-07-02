"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import z from "zod/v4";
import { searchCity } from "@/lib/geosearch";
import { Spinner } from "@/components/ui/spinner";
import { subscriptionFormSchema } from "./validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const buttonText = (
  isSubmitting: boolean,
  isSubmitSuccessful: boolean,
  isEdit: boolean
) => {
  if (isSubmitting) {
    return <Spinner />;
  }
  if (isSubmitSuccessful) {
    return <CheckIcon />;
  }
  if (isEdit) {
    return "Update Subscription";
  }
  return "Create Subscription";
};

export default function SubscriptionForm({
  closeDialog,
  onSubmit,
  defaultValues = {
    name: "",
    location: { latitude: 0, longitude: 0, name: "" },
    status: "active" as const,
  },
  id,
}: {
  closeDialog: () => void;
  onSubmit: (
    values: z.infer<typeof subscriptionFormSchema> & { id?: string }
  ) => Promise<void>;
  defaultValues?: z.input<typeof subscriptionFormSchema>;
  id?: string;
}) {
  const form = useForm({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues,
  });
  const [locationSearch, setLocationSearch] = React.useState("");
  const [locationOpen, setLocationOpen] = React.useState(false);
  const [locationSuggestions, setLocationSuggestions] = React.useState<
    { name: string; latitude: number; longitude: number }[]
  >([]);
  const [debouncedLocationSearch] = useDebounce(locationSearch, 500);

  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  useEffect(() => {
    searchCity(debouncedLocationSearch).then((locations) => {
      setLocationSuggestions(locations);
    });
  }, [debouncedLocationSearch]);

  async function handleSubmit({
    name,
    location,
    status,
  }: z.infer<typeof subscriptionFormSchema>) {
    await onSubmit({ name, location, status, id }).then(() => {
      closeDialog();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="London"
                  value={field.value}
                  onChange={field.onChange}
                />
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
                      {field.value.name || "Select city..."}
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
              <FormMessage>{errors.location?.name?.message}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting || isSubmitSuccessful}
          className="w-full"
        >
          {buttonText(isSubmitting, isSubmitSuccessful, !!id)}
        </Button>
      </form>
    </Form>
  );
}
