import { TECH_STACKS } from "@/constants/resume";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export default function TechStacks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tech Stacks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {TECH_STACKS.map((stack) => (
            <div key={stack.title}>
              <h4 className="font-semibold mb-3 text-slate-700 dark:text-slate-300">
                {stack.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {stack.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
