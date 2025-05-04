"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { pastPaperService } from "@/services/past-paper-service"
import { useLanguage } from "@/contexts/language-context"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  subjectCode: z.string().optional(),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear()),
  month: z.string().optional(),
  language: z.string().min(1, "Language is required"),
  paperNumber: z.coerce.number().int().min(1),
  level: z.enum(["SL", "HL", "Both"]),
  description: z.string().optional(),
  file: z.instanceof(File).refine((file) => file.size > 0, "File is required"),
})

type FormValues = z.infer<typeof formSchema>

export function UploadPastPaper() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
      subjectCode: "",
      year: new Date().getFullYear(),
      month: "",
      language: "English",
      paperNumber: 1,
      level: "SL",
      description: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsUploading(true)
    try {
      const result = await pastPaperService.uploadPastPaper(values.file, {
        title: values.title,
        subject: values.subject,
        subjectCode: values.subjectCode,
        year: values.year,
        month: values.month,
        language: values.language,
        paperNumber: values.paperNumber,
        level: values.level,
        description: values.description,
      })

      if (result) {
        toast({
          title: t("uploadSuccess"),
          description: t("pastPaperUploaded"),
        })
        router.push(`/past-papers/${result.id}`)
      } else {
        throw new Error("Upload failed")
      }
    } catch (error) {
      console.error("Error uploading past paper:", error)
      toast({
        title: t("uploadError"),
        description: t("pastPaperUploadFailed"),
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("title")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("pastPaperTitlePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subject")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("subjectPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("subjectCode")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("subjectCodePlaceholder")} {...field} />
                    </FormControl>
                    <FormDescription>{t("subjectCodeDescription")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("year")}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("month")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectMonth")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="May">{t("may")}</SelectItem>
                          <SelectItem value="November">{t("november")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("language")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("languagePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="paperNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("paperNumber")}</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("level")}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectLevel")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="SL">SL</SelectItem>
                          <SelectItem value="HL">HL</SelectItem>
                          <SelectItem value="Both">{t("both")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("descriptionPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("file")}</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              onChange(file)
                            }
                          }}
                          {...fieldProps}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>{t("fileDescription")}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⏳</span>
                  {t("uploading")}
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  {t("uploadPastPaper")}
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
