
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAdminSetup } from "@/hooks/useAdminSetup";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Building2, Calendar } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function AdminAcademicSetup() {
    const { academicYears, departments, isLoading, createYear, toggleYearActive, createDepartment } = useAdminSetup();

    // Year Form
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [newYearName, setNewYearName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Dept Form
    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [deptName, setDeptName] = useState("");
    const [deptCode, setDeptCode] = useState("");

    const handleCreateYear = () => {
        if (!newYearName || !startDate || !endDate) return;
        createYear.mutate({
            year_name: newYearName,
            start_date: startDate,
            end_date: endDate,
            is_active: false // Default to inactive when created? Or active if user wants? Let's say inactive
        }, {
            onSuccess: () => {
                setIsYearOpen(false);
                setNewYearName("");
                setStartDate("");
                setEndDate("");
            }
        });
    };

    const handleCreateDept = () => {
        if (!deptName || !deptCode) return;
        createDepartment.mutate({ name: deptName, code: deptCode }, {
            onSuccess: () => {
                setIsDeptOpen(false);
                setDeptName("");
                setDeptCode("");
            }
        });
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Academic Setup</h2>
                    <p className="text-muted-foreground">
                        Manage academic years and university departments.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Academic Years Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" /> Academic Years
                                </CardTitle>
                                <CardDescription>Define academic sessions</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => setIsYearOpen(true)}>
                                <Plus className="h-4 w-4 mr-1" /> Add Year
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Year</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead className="text-right">Active</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {academicYears?.map((year) => (
                                            <TableRow key={year.id}>
                                                <TableCell className="font-medium">{year.year_name}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {year.start_date} - {year.end_date}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Switch
                                                        checked={year.is_active}
                                                        onCheckedChange={(checked) => toggleYearActive.mutate({ id: year.id, isActive: checked })}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Departments Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" /> Departments
                                </CardTitle>
                                <CardDescription>University departments</CardDescription>
                            </div>
                            <Button size="sm" onClick={() => setIsDeptOpen(true)}>
                                <Plus className="h-4 w-4 mr-1" /> Add Dept
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Name</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {departments?.map((dept) => (
                                            <TableRow key={dept.id}>
                                                <TableCell className="font-medium">
                                                    <Badge variant="outline">{dept.code}</Badge>
                                                </TableCell>
                                                <TableCell>{dept.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Dialogs */}
                <Dialog open={isYearOpen} onOpenChange={setIsYearOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Academic Year</DialogTitle>
                            <DialogDescription>Create a new academic session.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="yearName">Year Name</Label>
                                <Input id="yearName" placeholder="e.g. 2025-26" value={newYearName} onChange={e => setNewYearName(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="start">Start Date</Label>
                                    <Input id="start" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="end">End Date</Label>
                                    <Input id="end" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsYearOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateYear}>Create Year</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isDeptOpen} onOpenChange={setIsDeptOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Department</DialogTitle>
                            <DialogDescription>Register a new department.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="code">Department Code</Label>
                                <Input id="code" placeholder="e.g. CSE" value={deptCode} onChange={e => setDeptCode(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Department Name</Label>
                                <Input id="name" placeholder="e.g. Computer Science & Engineering" value={deptName} onChange={e => setDeptName(e.target.value)} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeptOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateDept}>Add Department</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    );
}
