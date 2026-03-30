import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!collegeId.trim()) e.collegeId = "College ID is required";
    if (!collegeName.trim()) e.collegeName = "College name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    login({ name: name.trim(), collegeId: collegeId.trim(), collegeName: collegeName.trim() });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 animate-fade-up">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">MedBuddy</h1>
          <p className="text-sm text-muted-foreground">AI Campus Health Companion</p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h2 className="font-display font-semibold text-lg text-center text-foreground">Student Login</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="collegeId">College ID</Label>
                <Input
                  id="collegeId"
                  placeholder="e.g. STU2024001"
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                  maxLength={50}
                />
                {errors.collegeId && <p className="text-xs text-destructive">{errors.collegeId}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="collegeName">College Name</Label>
                <Input
                  id="collegeName"
                  placeholder="e.g. MIT"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  maxLength={150}
                />
                {errors.collegeName && <p className="text-xs text-destructive">{errors.collegeName}</p>}
              </div>

              <Button type="submit" className="w-full">
                Get Started
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-[11px] text-muted-foreground text-center">
          Your data stays on your device. No account needed.
        </p>
      </div>
    </div>
  );
};

export default Login;
