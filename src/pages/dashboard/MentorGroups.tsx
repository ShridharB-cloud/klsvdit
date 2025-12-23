
import { useMentorGroups } from "@/hooks/useMentorGroups";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Clock
} from "lucide-react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
    "active": { icon: Clock, label: "Active", variant: "default" as const },
    "completed": { icon: CheckCircle2, label: "Completed", variant: "success" as const },
    "delayed": { icon: AlertCircle, label: "Delayed", variant: "destructive" as const },
    "inactive": { icon: XCircle, label: "Inactive", variant: "secondary" as const },
    // Map old statuses if needed
    "on-track": { icon: CheckCircle2, label: "On Track", variant: "success" as const },
    "needs-attention": { icon: AlertCircle, label: "Needs Attention", variant: "warning" as const },
};

export default function MentorGroups() {
    const { groups, isLoading } = useMentorGroups();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredGroups = groups?.filter(group =>
        group.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.group_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="mentor">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Assigned Groups</h2>
                        <p className="text-muted-foreground">
                            Manage and monitor your assigned project teams.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <Button>
                            <Users className="h-4 w-4 mr-2" />
                            Add Group
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by group ID or project title..."
                        className="pl-9 max-w-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div>Loading groups...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredGroups?.map((group: any) => {
                            // Handle legacy/mock data fields vs real DB fields
                            const statusKey = group.status || "active";
                            const config = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig["active"];
                            const StatusIcon = config.icon;

                            return (
                                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base font-semibold">
                                                {group.group_id}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-1">
                                                {group.project_title}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={config.variant}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {config.label}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mt-4 space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Members:</span>
                                                <span className="font-medium flex items-center">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {group.members_count || group.members || 0}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Current Phase:</span>
                                                <span className="font-medium">Phase {group.current_phase || 1}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Last Updated:</span>
                                                <span className="font-medium">
                                                    {group.updated_at
                                                        ? new Date(group.updated_at).toLocaleDateString()
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="sm">Details</Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>View Diary</DropdownMenuItem>
                                                    <DropdownMenuItem>View Phases</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Report Issue</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
