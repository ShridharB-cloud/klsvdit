
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminUsers, AppRole } from "@/hooks/useAdminUsers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, UserCog, Shield, GraduationCap, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminUsers() {
    const { users, isLoading, updateUserRole } = useAdminUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<AppRole | 'all'>('all');

    const filteredUsers = users?.filter(user => {
        const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
        return matchesSearch && matchesRole;
    });

    const handleRoleChange = (userId: string, role: AppRole, hasRole: boolean) => {
        updateUserRole.mutate({
            userId,
            role,
            action: hasRole ? 'remove' : 'add'
        });
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-muted-foreground">
                        Manage user roles and permissions.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Users Directory</CardTitle>
                                <CardDescription>
                                    View and manage all registered users.
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search users..."
                                        className="pl-8 w-[250px]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            Filter Role: {roleFilter === 'all' ? 'All' : roleFilter}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setRoleFilter('all')}>All</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setRoleFilter('student')}>Students</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setRoleFilter('mentor')}>Mentors</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setRoleFilter('admin')}>Admins</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div>Loading users...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Roles</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers?.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                                                No users found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filteredUsers?.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.avatar_url} />
                                                    <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="font-medium">
                                                    {user.full_name}
                                                    {/* We could show email here if we had it */}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {user.roles.includes('admin') && (
                                                        <Badge variant="destructive" className="flex items-center gap-1">
                                                            <Shield className="w-3 h-3" /> Admin
                                                        </Badge>
                                                    )}
                                                    {user.roles.includes('mentor') && (
                                                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 border-blue-500/20 flex items-center gap-1">
                                                            <UserCog className="w-3 h-3" /> Mentor
                                                        </Badge>
                                                    )}
                                                    {user.roles.includes('student') && (
                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                            <GraduationCap className="w-3 h-3" /> Student
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Manage Roles</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuCheckboxItem
                                                            checked={user.roles.includes('admin')}
                                                            onCheckedChange={() => handleRoleChange(user.id, 'admin', user.roles.includes('admin'))}
                                                        >
                                                            Admin Access
                                                        </DropdownMenuCheckboxItem>
                                                        <DropdownMenuCheckboxItem
                                                            checked={user.roles.includes('mentor')}
                                                            onCheckedChange={() => handleRoleChange(user.id, 'mentor', user.roles.includes('mentor'))}
                                                        >
                                                            Mentor Access
                                                        </DropdownMenuCheckboxItem>
                                                        <DropdownMenuCheckboxItem
                                                            checked={user.roles.includes('student')}
                                                            onCheckedChange={() => handleRoleChange(user.id, 'student', user.roles.includes('student'))}
                                                        >
                                                            Student Access
                                                        </DropdownMenuCheckboxItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
