
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminPhases, ProjectPhaseConfig } from "@/hooks/useAdminPhases";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { CalendarIcon, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function AdminPhases() {
    const { phases, isLoading, updatePhase } = useAdminPhases();

    // Simple state to track edits before saving? 
    // Or save on change for switches, and confirm for dates?
    // Let's do direct updates for now for simplicity, users expect instant save often in admin panels 
    // or maybe a small delay.
    // For dates, it's better to have them explicitly selected.

    const handleDateChange = (id: string, field: 'start_date' | 'end_date', date: Date | undefined) => {
        if (!date) return;
        // Format to YYYY-MM-DD
        // Ensure timezone doesn't shift it unexpectedly, usually standard iso string split is safer for literal dates
        // but let's use local date string for simplicity of input
        const dateString = format(date, "yyyy-MM-dd");
        updatePhase.mutate({ id, [field]: dateString });
    };

    const handleToggleLock = (phase: ProjectPhaseConfig) => {
        updatePhase.mutate({ id: phase.id, is_locked: !phase.is_locked });
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Academic Maintenance</h2>
                    <p className="text-muted-foreground">
                        Configure project phases, deadlines, and submission locks.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Phase Configuration</CardTitle>
                        <CardDescription>
                            Set start/end dates for each phase. Locking a phase prevents new submissions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div>Loading phases...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Phase</TableHead>
                                        <TableHead>Name & Description</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date/Deadline</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {phases?.map((phase) => (
                                        <TableRow key={phase.id}>
                                            <TableCell className="font-medium">
                                                <Badge variant="outline">Phase {phase.phase_number}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{phase.phase_name}</div>
                                                <div className="text-sm text-muted-foreground line-clamp-1">{phase.description}</div>
                                            </TableCell>
                                            <TableCell>
                                                <DatePicker
                                                    date={phase.start_date ? new Date(phase.start_date) : undefined}
                                                    onSelect={(d) => handleDateChange(phase.id, 'start_date', d)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <DatePicker
                                                    date={phase.end_date ? new Date(phase.end_date) : undefined}
                                                    onSelect={(d) => handleDateChange(phase.id, 'end_date', d)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={phase.is_locked}
                                                        onCheckedChange={() => handleToggleLock(phase)}
                                                    />
                                                    {phase.is_locked ? (
                                                        <span className="flex items-center text-xs text-destructive font-medium">
                                                            <Lock className="w-3 h-3 mr-1" /> Locked
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center text-xs text-success font-medium">
                                                            <Unlock className="w-3 h-3 mr-1" /> Active
                                                        </span>
                                                    )}
                                                </div>
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

function DatePicker({ date, onSelect }: { date?: Date, onSelect: (date: Date | undefined) => void }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={`w-[140px] pl-3 text-left font-normal ${!date && "text-muted-foreground"}`}
                >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={onSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
