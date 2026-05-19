"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { User, FileText } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  description: z.string().optional(),
  startTime: z.date({
    required_error: "Start time is required",
  }),
  endTime: z.date({
    required_error: "End time is required",
  }),
  status: z.enum(["Scheduled", "Completed", "Cancelled", "No-show"]),
  patientId: z.string().min(1, "Patient is required"),
  caseId: z.string().optional(),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time",
  path: ["endTime"],
});

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId?: string; // For editing existing appointments
  defaultStartTime?: Date; // Pre-filled from calendar click
  defaultEndTime?: Date; // Pre-filled from calendar click
  onSuccess?: () => void; // Callback after successful create/update
}

interface Patient {
  id: string;
  name: string;
}

interface Case {
  id: string;
  case_name: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  open,
  onOpenChange,
  appointmentId,
  defaultStartTime,
  defaultEndTime,
  onSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const isEditMode = !!appointmentId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      startTime: defaultStartTime || new Date(),
      endTime: defaultEndTime || new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
      status: "Scheduled",
      patientId: "",
      caseId: undefined,
    },
  });

  // Fetch patients and cases for selectors
  useEffect(() => {
    if (open) {
      fetchPatientsAndCases();
      if (appointmentId) {
        fetchAppointmentData();
      } else {
        // Reset form with default times for new appointment
        form.reset({
          title: "",
          description: "",
          startTime: defaultStartTime || new Date(),
          endTime: defaultEndTime || new Date(Date.now() + 60 * 60 * 1000),
          status: "Scheduled",
          patientId: "",
          caseId: undefined,
        });
      }
    }
  }, [open, appointmentId, defaultStartTime, defaultEndTime]);

  const fetchPatientsAndCases = async () => {
    try {
      const [patientsRes, casesRes] = await Promise.all([
        fetch("/api/patients"),
        fetch("/api/cases"),
      ]);

      const patientsData = await patientsRes.json();
      const casesData = await casesRes.json();

      setPatients(patientsData);
      setCases(casesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load patients and cases");
    }
  };

  const fetchAppointmentData = async () => {
    setLoadingData(true);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      const data = await response.json();

      if (response.ok) {
        form.reset({
          title: data.title,
          description: data.description || "",
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          status: data.status,
          patientId: data.patientId,
          caseId: data.caseId || "",
        });
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast.error("Failed to load appointment data");
    } finally {
      setLoadingData(false);
    }
  };

  const checkOverlap = async (startTime: Date, endTime: Date, currentId?: string) => {
    try {
      const response = await fetch("/api/appointments");
      const appointments = await response.json();

      const overlapping = appointments.filter((apt: any) => {
        if (currentId && apt.id === currentId) return false; // Skip current appointment in edit mode
        
        const aptStart = new Date(apt.startTime);
        const aptEnd = new Date(apt.endTime);

        return (
          (startTime >= aptStart && startTime < aptEnd) ||
          (endTime > aptStart && endTime <= aptEnd) ||
          (startTime <= aptStart && endTime >= aptEnd)
        );
      });

      return overlapping.length > 0;
    } catch (error) {
      console.error("Error checking overlaps:", error);
      return false;
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    // Check for overlaps
    const hasOverlap = await checkOverlap(
      values.startTime,
      values.endTime,
      appointmentId
    );

    if (hasOverlap) {
      toast.warning(
        "⚠️ This appointment overlaps with another appointment",
        {
          description: "You can still save it if needed.",
          duration: 5000,
        }
      );
    }

    const formData = new FormData();
    formData.append("title", values.title);
    if (values.description) formData.append("description", values.description);
    formData.append("startTime", values.startTime.toISOString());
    formData.append("endTime", values.endTime.toISOString());
    formData.append("status", values.status);
    formData.append("patientId", values.patientId);
    if (values.caseId) formData.append("caseId", values.caseId);

    try {
      const url = isEditMode
        ? `/api/appointments/${appointmentId}`
        : "/api/appointments/new";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save appointment");
      }

      toast.success(
        isEditMode
          ? "Appointment updated successfully!"
          : "Appointment created successfully!"
      );

      form.reset();
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save appointment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Appointment" : "Schedule New Appointment"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update appointment details below"
                : "Fill in the details to create a new appointment"}
            </DialogDescription>
          </DialogHeader>

          {loadingData ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#19287A]"></div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Regular Checkup, Teeth Cleaning"
                          disabled={submitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Patient & Case */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient *</FormLabel>
                        <FormControl>
                          <Select
                            disabled={submitting}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient" />
                            </SelectTrigger>
                            <SelectContent>
                              {patients.map((patient) => (
                                <SelectItem key={patient.id} value={patient.id}>
                                  <User className="inline mr-2 h-4 w-4" />
                                  {patient.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="caseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Case (Optional)</FormLabel>
                        <FormControl>
                          <Select
                            disabled={submitting}
                            value={field.value || "NONE"}
                            onValueChange={(value) => {
                              field.onChange(value === "NONE" ? undefined : value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select case (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NONE">None</SelectItem>
                              {cases.map((caseItem) => (
                                <SelectItem key={caseItem.id} value={caseItem.id}>
                                  <FileText className="inline mr-2 h-4 w-4" />
                                  {caseItem.case_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Start Time & End Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time *</FormLabel>
                        <FormControl>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              value={dayjs(field.value)}
                              onChange={(newValue) => {
                                if (newValue) {
                                  field.onChange(newValue.toDate());
                                }
                              }}
                              disabled={submitting}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time *</FormLabel>
                        <FormControl>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                              value={dayjs(field.value)}
                              onChange={(newValue) => {
                                if (newValue) {
                                  field.onChange(newValue.toDate());
                                }
                              }}
                              disabled={submitting}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  size: "small",
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          disabled={submitting}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                            <SelectItem value="No-show">No-show</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes or details about the appointment..."
                          disabled={submitting}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#19287A] hover:bg-[#0C8F8F]"
                    disabled={!form.formState.isValid || submitting}
                  >
                    {submitting
                      ? isEditMode
                        ? "Updating..."
                        : "Creating..."
                      : isEditMode
                      ? "Update Appointment"
                      : "Create Appointment"}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
