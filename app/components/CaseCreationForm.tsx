import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "./DatePicker";
import { FancySelect } from "./FancySelect";
import { PatientLight } from "../types/Patient";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  case_name: z.string().min(10).max(500),
  intervention_date: z.date(),
  patient_id: z.string(),
  report: z.any().optional(),
  doctor_note: z.string().optional(),
});

const CaseCreationForm = () => {
  const [patientsList, setPatientsList] = useState<PatientLight[] | null>(null);
  const [, setSelectedPatient] = useState<PatientLight | null>(
    null
  );
  const [loadingPatientList, setLoadingPatientList] = useState(true);
  const [submittingForm, setSubmittingForm] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      case_name: "",
      intervention_date: new Date(),
      patient_id: "",
      report: { data: "", name: "" },
      doctor_note: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmittingForm(true);

    const formData = new FormData();

    const submitPromise = (async () => {
      formData.append("case_name", values.case_name);
      formData.append(
        "intervention_date",
        values.intervention_date.toISOString()
      );
      formData.append("patient_id", values.patient_id);
      formData.append("doctor_note", values?.doctor_note ?? "");

      // Only append if a file is selected
      if (values.report instanceof File) {
        formData.append("report", values.report);
      }

      try {
        const response = await fetch(`/api/cases/new`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to create case");
        }

        return data.id;
      } catch (error) {
        console.error(error);
        setSubmittingForm(false);
      }
    })();

    toast.promise(submitPromise, {
      loading: "Submitting case data...",
      success: "Case created successfully!",
      error: "Failed to create case.",
    });

    setSubmittingForm(false);

    return submitPromise
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoadingPatientList(true);

      try {
        const response = await fetch(`/api/patients-list`);
        const patientsList: PatientLight[] = await response.json();
        setPatientsList(patientsList);
        setLoadingPatientList(false);
      } catch (error) {
        console.error(error)
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={async (e) => {
            let newCaseId: string | undefined;
            await form.handleSubmit(async (values) => {
              newCaseId = await onSubmit(values);
              if (newCaseId) {
                router.push(`/cases/${newCaseId}`)
              } else {
                router.push(`/cases`)
              }
              toast.info(`Redirecting to '${newCaseId}' page...`)
            })(e);
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 gap-6">
            {/* Case Name - full row */}
            <FormField
              control={form.control}
              name="case_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Case Name"
                      disabled={submittingForm}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Patient - half row each */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="intervention_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePicker
                        name="Intervention Date"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={submittingForm}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <FormControl>
                      <FancySelect
                        options={(patientsList || []).map((patient) => ({
                          value: patient.id,
                          label: patient.name,
                        }))}
                        value={field.value}
                        onChange={(value: string) => {
                          field.onChange(value);
                          const patient =
                            (patientsList || []).find((p) => p.id === value) ||
                            null;
                          setSelectedPatient(patient);
                        }}
                        isLoading={loadingPatientList}
                        disabled={submittingForm}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Upload - half row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="report"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload a Report</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        className="file-input"
                        disabled={submittingForm}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file); // just pass the file
                          } else {
                            field.onChange(null);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Accepted formats: PDF, DOC, DOCX, JPG, PNG
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Empty column for spacing */}
              <div />
            </div>

            {/* Doctor Note - full row */}
            <FormField
              control={form.control}
              name="doctor_note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor Note</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add any notes for this case"
                      disabled={submittingForm}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between gap-4">
            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                className="border border-red-300 text-red-600 hover:bg-red-100 transition-colors"
                disabled={submittingForm}
                onClick={() => {
                  // You can add custom cancel logic here, e.g., close modal or navigate away
                  form.reset();
                }}
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="outline"
                className="text-[#19287A] border-[#19287A] hover:bg-[#19287A40] transition-colors"
                disabled={submittingForm}
                onClick={() => {
                  form.reset();
                  toast.info("Form cleared!");
                }}
              >
                Clear
              </Button>
            </div>

            <Button
              type="submit"
              disabled={submittingForm}
              className="bg-[#0C8F8F] hover:bg-[#467f7f] text-white font-semibold transition-colors px-8 py-3 text-lg"
            >
              {submittingForm ? (
                <>
                  <span className="animate-pulse">Submitting Data</span>
                  <svg
                    className="inline ml-2 w-5 h-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </>
              ) : (
                "Create Case"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <Toaster richColors={true} />
    </>
  );
};

export default CaseCreationForm;
