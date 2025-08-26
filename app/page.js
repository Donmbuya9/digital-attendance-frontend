import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Digital Attendance System</CardTitle>
          <CardDescription className="text-center">
            Welcome to the Digital Attendance System. Shadcn UI setup is complete!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            ✅ Next.js 15 with App Router<br/>
            ✅ Tailwind CSS v4<br/>
            ✅ Shadcn UI Components<br/>
            ✅ Development server running
          </div>
          <div className="text-center">
            <Button className="w-full">Ready for Development!</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
