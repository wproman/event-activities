
import CreateHostForm from "@/components/modules/Host/register-host-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function CreateHostPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Become a Host</CardTitle>
            <CardDescription className="text-lg">
              Create your host account to start offering amazing experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateHostForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}