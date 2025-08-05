import { TECH_STACKS } from "@/constants/resume";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Github, Mail, MapPin, Phone } from "lucide-react";

export default function Profiles() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/avatar.jpg" alt="Profile" />
            <AvatarFallback>JH</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">이준혁</CardTitle>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Frontend Developer
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">Next.js</Badge>
              <Badge variant="secondary">TypeScript</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>anshqhsh.dev@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>010-4031-2329</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>서울, 대한민국</span>
          </div>
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            <a
              href="https://github.com/anshqhsh"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              github.com/anshqhsh
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
