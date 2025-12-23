
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminGroups } from "@/hooks/useAdminGroups";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Plus, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminGroups() {
    const { groups, isLoading, createGroup, updateMentor } = useAdminGroups();
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    // Form states
    const [newGroupId, setNewGroupId] = useState("");
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [selectedMentor, setSelectedMentor] = useState("");

    // Fetch mentors for assignment dropdown
    const { data: mentors } = useQuery({
        queryKey: ["admin-mentors-list"],
        queryFn: async () => {
            // Get mentor role user_ids
            const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "mentor");
            const ids = roles?.map(r => r.user_id) || [];
            if (ids.length === 0) return [];

            const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", ids);
            return profiles || [];
        }
    });

    const filteredGroups = groups?.filter(g =>
        g.group_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.project_title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateGroup = () => {
        if (!newGroupId || !newProjectTitle) return;
        createGroup.mutate({ group_id: newGroupId, project_title: newProjectTitle }, {
            onSuccess: () => {
                setIsCreateOpen(false);
                setNewGroupId("");
                setNewProjectTitle("");
            }
        });
    };

    const handleAssignMentor = () => {
        if (!selectedGroup) return;
        updateMentor.mutate({ groupId: selectedGroup, mentorId: selectedMentor || null }, {
            onSuccess: () => {
                setIsAssignOpen(false);
                setSelectedGroup(null);
                setSelectedMentor("");
            }
        });
    };

    const openAssignDialog = (groupId: string, currentMentorId?: string) => {
        setSelectedGroup(groupId);
        setSelectedMentor(currentMentorId || "");
        setIsAssignOpen(true);
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Group Management</h2>
                        <p className="text-muted-foreground">
                            Create groups and assign mentors.
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" /> Create Group
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Project Groups</CardTitle>
                            <div className="relative w-[250px]">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search groups..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div>Loading groups...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Group ID</TableHead>
                                        <TableHead>Project Title</TableHead>
                                        <TableHead>Mentor</TableHead>
                                        <TableHead>Members</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredGroups?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No groups found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredGroups?.map((group) => (
                                        <TableRow key={group.id}>
                                            <TableCell className="font-medium">{group.group_id}</TableCell>
                                            <TableCell>{group.project_title}</TableCell>
                                            <TableCell>
                                                {group.mentor_id ? (
                                                    <span className="flex items-center gap-1 text-primary">
                                                        <UserPlus className="h-3 w-3" /> {group.mentor_name}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground italic">Unassigned</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="flex w-fit items-center gap-1">
                                                    <Users className="h-3 w-3" /> {group.member_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={group.status === 'active' ? 'default' : 'secondary'}>
                                                    {group.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => openAssignDialog(group.id, group.mentor_id)}>
                                                    Assign Mentor
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Create Group Dialog */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Group</DialogTitle>
                            <DialogDescription>Add a new project group to the system.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Group ID</label>
                                <Input placeholder="e.g. GRP-2025-CS-001" value={newGroupId} onChange={(e) => setNewGroupId(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project Title</label>
                                <Input placeholder="Project Name" value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateGroup}>Create Group</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Assign Mentor Dialog */}
                <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign Mentor</DialogTitle>
                            <DialogDescription>Select a faculty member to guide this group.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Mentor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassign">Unassign (No Mentor)</SelectItem> {/* Handle specially */}
                                    {mentors?.map(m => (
                                        <SelectItem key={m.user_id} value={m.user_id}>{m.full_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
                            <Button onClick={handleAssignMentor}>Save Assignment</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </DashboardLayout>
    );
}
