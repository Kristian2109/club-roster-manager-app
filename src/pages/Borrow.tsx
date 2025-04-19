
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi, itemsApi, borrowApi } from "@/lib/api";
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
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateBorrowDTO } from "@/types/borrow";

const Borrow = () => {
  const { toast } = useToast();
  const [memberSearch, setMemberSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [openMember, setOpenMember] = useState(false);
  const [openItem, setOpenItem] = useState(false);

  const form = useForm<CreateBorrowDTO>({
    defaultValues: {
      memberId: "",
      inventoryItemId: "",
      days: 1,
    },
  });

  const queryClient = useQueryClient();

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: membersApi.getAll,
  });

  const { data: items = [] } = useQuery({
    queryKey: ["items"],
    queryFn: itemsApi.getAll,
  });

  const createBorrowMutation = useMutation({
    mutationFn: borrowApi.create,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item borrowed successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["borrows"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to borrow item",
        variant: "destructive",
      });
    },
  });

  const filteredMembers = members.filter(
    (member) =>
      member.firstName.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.lastName.toLowerCase().includes(memberSearch.toLowerCase()) ||
      member.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const onSubmit = (data: CreateBorrowDTO) => {
    createBorrowMutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Borrow an Item</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-md">
          <FormField
            control={form.control}
            name="memberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member</FormLabel>
                <FormControl>
                  <Popover open={openMember} onOpenChange={setOpenMember}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {field.value
                          ? members.find((member) => member.id === field.value)
                            ? `${
                                members.find((member) => member.id === field.value)
                                  ?.firstName
                              } ${
                                members.find((member) => member.id === field.value)
                                  ?.lastName
                              }`
                            : "Select member"
                          : "Select member"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search members..."
                          value={memberSearch}
                          onValueChange={setMemberSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No members found.</CommandEmpty>
                          {filteredMembers.map((member) => (
                            <CommandItem
                              key={member.id}
                              value={member.id}
                              onSelect={() => {
                                form.setValue("memberId", member.id);
                                setOpenMember(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  member.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {member.firstName} {member.lastName} ({member.email})
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inventoryItemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item</FormLabel>
                <FormControl>
                  <Popover open={openItem} onOpenChange={setOpenItem}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {field.value
                          ? items.find((item) => item.id === field.value)?.name ||
                            "Select item"
                          : "Select item"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search items..."
                          value={itemSearch}
                          onValueChange={setItemSearch}
                        />
                        <CommandList>
                          <CommandEmpty>No items found.</CommandEmpty>
                          {filteredItems.map((item) => (
                            <CommandItem
                              key={item.id}
                              value={item.id}
                              onSelect={() => {
                                form.setValue("inventoryItemId", item.id);
                                setOpenItem(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {item.name} (SN: {item.serialNumber})
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Days</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormDescription>
                  How many days do you want to borrow the item for?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Borrow Item</Button>
        </form>
      </Form>
    </div>
  );
};

export default Borrow;
