import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi, itemsApi, borrowApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateBorrowDTO } from "@/types/borrow";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  const { data: borrowings = [] } = useQuery({
    queryKey: ["borrowings"],
    queryFn: borrowApi.getAll,
  });

  const createBorrowMutation = useMutation({
    mutationFn: borrowApi.create,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item borrowed successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to borrow item",
        variant: "destructive",
      });
    },
  });

  const returnItemMutation = useMutation({
    mutationFn: borrowApi.return,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item returned successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["borrowings"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to return item",
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

  const handleReturn = (borrowId: string) => {
    returnItemMutation.mutate(borrowId);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Borrow an Item</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Borrowings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Borrowed Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowings.map((borrow) => {
                const member = members.find((m) => m.id === borrow.memberId);
                const item = items.find((i) => i.id === borrow.itemId);

                return (
                  <TableRow key={borrow.id}>
                    <TableCell>
                      {member ? `${member.firstName} ${member.lastName}` : "Unknown"}
                    </TableCell>
                    <TableCell>{item?.name || "Unknown"}</TableCell>
                    <TableCell>{new Date(borrow.borrowedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(borrow.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{borrow.returned ? "Returned" : "Active"}</TableCell>
                    <TableCell>
                      {!borrow.returned && (
                        <Button
                          variant="outline"
                          onClick={() => handleReturn(borrow.id)}
                        >
                          Return
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Borrow;
