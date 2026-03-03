import ContactForm from "@/components/features/contact/ContactForm";
import EnrollmentForm from "@/components/features/contact/EnrollmentForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SanityFormField } from "@/lib/utils/form-utils";
import { cn } from "@/lib/utils/ui-utils";
import { MessageSquare, Music } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ContactTabsProps {
  enrollmentActive: boolean;
  contactTabLabel: string;
  contactFormHeading?: string | null;
  contactFormDescription?: string | null;
  enrollmentTabLabel: string;
  enrollmentFormHeading?: string | null;
  enrollmentFormDescription?: string | null;
  enrollmentFormFields: SanityFormField[];
}

type TabValue = "contact" | "enrollment";

export default function ContactTabs({
  enrollmentActive,
  contactTabLabel,
  contactFormHeading,
  contactFormDescription,
  enrollmentTabLabel,
  enrollmentFormHeading,
  enrollmentFormDescription,
  enrollmentFormFields,
}: Readonly<ContactTabsProps>) {
  const [active, setActive] = useState<TabValue>("contact");

  const tabs = [
    { value: "contact" as TabValue, label: contactTabLabel, icon: MessageSquare },
    ...(enrollmentActive ? [{ value: "enrollment" as TabValue, label: enrollmentTabLabel, icon: Music }] : []),
  ];

  useEffect(() => {
    if (!enrollmentActive && active === "enrollment") {
      setActive("contact");
    }
  }, [enrollmentActive, active]);

  return (
    <Tabs value={active} onValueChange={(v) => setActive(v as TabValue)}>
      <ScrollArea className="w-full mb-3">
        <TabsList className="inline-flex w-full bg-primary-foreground rounded-xl border border-border py-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.value;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "relative py-5 gap-2 text-muted-foreground",
                  "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  tab.value === "contact"
                    ? "data-[state=active]:text-primary-foreground"
                    : "data-[state=active]:text-accent-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-indicator"
                    className={cn("absolute inset-0 rounded-lg", tab.value === "contact" ? "bg-primary" : "bg-accent")}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="w-4 h-4 relative" />
                <span className="relative">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="contact" forceMount className={active === "contact" ? "block" : "hidden"}>
        <motion.div
          key="contact"
          animate={{ opacity: active === "contact" ? 1 : 0, y: active === "contact" ? 0 : 6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <Card>
            {(contactFormHeading || contactFormDescription) && (
              <CardHeader>
                {contactFormHeading && <h2 className="heading-3">{contactFormHeading}</h2>}
                {contactFormDescription && <p className="body-text">{contactFormDescription}</p>}
              </CardHeader>
            )}
            <CardContent className={cn(contactFormHeading || contactFormDescription ? "pt-0" : "pt-6")}>
              <ContactForm isActive={active === "contact"} />
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>

      {enrollmentActive && (
        <TabsContent value="enrollment" forceMount className={active === "enrollment" ? "block" : "hidden"}>
          <motion.div
            key="enrollment"
            animate={{ opacity: active === "enrollment" ? 1 : 0, y: active === "enrollment" ? 0 : 6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Card>
              {(enrollmentFormHeading || enrollmentFormDescription) && (
                <CardHeader>
                  {enrollmentFormHeading && <h2 className="heading-3">{enrollmentFormHeading}</h2>}
                  {enrollmentFormDescription && (
                    <div className="p-4 bg-accent/10 border border-accent/25 rounded-xl">
                      <p className="font-sans text-sm font-medium text-foreground/90 flex items-start gap-3 leading-relaxed">
                        <Music className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        {enrollmentFormDescription}
                      </p>
                    </div>
                  )}
                </CardHeader>
              )}
              <CardContent className={cn(enrollmentFormHeading || enrollmentFormDescription ? "pt-0" : "pt-6")}>
                <EnrollmentForm fields={enrollmentFormFields} isActive={active === "enrollment"} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      )}
    </Tabs>
  );
}
