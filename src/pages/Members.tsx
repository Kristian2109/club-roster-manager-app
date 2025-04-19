
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersApi } from "@/lib/api";
import { Member, CreateMemberDTO } from "@/types/member";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Trash2, UserPlus } from "lucide-react";

export default function Members() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMember, setNewMember] = useState<CreateMemberDTO>({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Fetch members
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["members"],
    queryFn: membersApi.getAll,
  });

  // Create member mutation
  const createMutation = useMutation({
    mutationFn: membersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast({
        title: "Success",
        description: "Member created successfully",
      });
      setNewMember({ firstName: "", lastName: "", email: "" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create member",
        variant: "destructive",
      });
    },
  });

  // Delete member mutation
  const deleteMutation = useMutation({
    mutationFn: membersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newMember);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Club Members</h1>

      {/* Add Member Form */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus size={24} />
          Add New Member
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap">
          <Input
            placeholder="First Name"
            value={newMember.firstName}
            onChange={(e) =>
              setNewMember({ ...newMember, firstName: e.target.value })
            }
            className="max-w-[200px]"
          />
          <Input
            placeholder="Last Name"
            value={newMember.lastName}
            onChange={(e) =>
              setNewMember({ ...newMember, lastName: e.target.value })
            }
            className="max-w-[200px]"
          />
          <Input
            type="email"
            placeholder="Email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            className="max-w-[300px]"
          />
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Adding..." : "Add Member"}
          </Button>
        </form>
      </Card>

      {/* Members Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.firstName}</TableCell>
                <TableCell>{member.lastName}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(member.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
