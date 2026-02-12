import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Briefcase, GraduationCap, Star, User } from 'lucide-react';
import { DoctorCredentials } from '../backend';
import EditableImage from './EditableImage';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateDoctorCredentials } from '../hooks/useQueries';

interface DoctorCredentialsCardProps {
  credentials?: DoctorCredentials | null;
  isAdmin: boolean;
}

export default function DoctorCredentialsCard({ credentials, isAdmin }: DoctorCredentialsCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: credentials?.name ?? '',
    qualifications: credentials?.qualifications ?? '',
    specializations: credentials?.specializations ?? '',
    yearsOfExperience: credentials?.yearsOfExperience ?? '',
    achievements: credentials?.achievements ?? '',
  });

  const updateCredentialsMutation = useUpdateDoctorCredentials();

  const hasContent = credentials && (
    credentials.name ||
    credentials.qualifications ||
    credentials.specializations ||
    credentials.yearsOfExperience ||
    credentials.achievements
  );

  const handleSave = async () => {
    if (!credentials) return;
    
    await updateCredentialsMutation.mutateAsync({
      ...credentials,
      ...formData,
    });
    setIsEditDialogOpen(false);
  };

  const handleEdit = () => {
    setFormData({
      name: credentials?.name ?? '',
      qualifications: credentials?.qualifications ?? '',
      specializations: credentials?.specializations ?? '',
      yearsOfExperience: credentials?.yearsOfExperience ?? '',
      achievements: credentials?.achievements ?? '',
    });
    setIsEditDialogOpen(true);
  };

  if (!hasContent && !isAdmin) {
    return null;
  }

  return (
    <>
      <Card className="hover-lift hover:shadow-glow-primary transition-all duration-500 border-2 border-border hover:border-primary/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        {/* Gradient Top Border */}
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
        
        <CardHeader className="pb-6">
          <CardTitle className="text-xl font-bold flex items-center justify-between">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Professional Credentials
            </span>
            {isAdmin && (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Image Section */}
            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <div className="relative group">
                <div className="absolute -inset-3 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <EditableImage
                  imageId="doctor-credentials-profile"
                  alt="Doctor Profile"
                  className="relative w-48 h-48 rounded-2xl object-cover shadow-elevation-3 group-hover:shadow-glow-primary transition-all duration-500 border-4 border-white/10"
                  isAdmin={isAdmin}
                  description="Doctor Credentials Profile Image"
                  supportsDarkMode={false}
                />
              </div>
            </div>

            {/* Credentials Details */}
            <div className="lg:col-span-2 space-y-6">
              {credentials?.name && (
                <div className="flex items-start gap-4 group">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex-shrink-0 shadow-elevation-2 group-hover:shadow-glow-primary transition-all duration-500">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Name</h4>
                    <p className="text-base text-foreground leading-relaxed font-medium">{credentials.name}</p>
                  </div>
                </div>
              )}

              {credentials?.qualifications && (
                <div className="flex items-start gap-4 group">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex-shrink-0 shadow-elevation-2 group-hover:shadow-glow-secondary transition-all duration-500">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Qualifications</h4>
                    <p className="text-base text-foreground leading-relaxed">{credentials.qualifications}</p>
                  </div>
                </div>
              )}

              {credentials?.specializations && (
                <div className="flex items-start gap-4 group">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex-shrink-0 shadow-elevation-2 group-hover:shadow-glow-accent transition-all duration-500">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Specializations</h4>
                    <p className="text-base text-foreground leading-relaxed">{credentials.specializations}</p>
                  </div>
                </div>
              )}

              {credentials?.yearsOfExperience && (
                <div className="flex items-start gap-4 group">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-success to-success/70 flex-shrink-0 shadow-elevation-2 transition-all duration-500">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Experience</h4>
                    <p className="text-base text-foreground leading-relaxed">{credentials.yearsOfExperience}</p>
                  </div>
                </div>
              )}

              {credentials?.achievements && (
                <div className="flex items-start gap-4 group">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-warning to-warning/70 flex-shrink-0 shadow-elevation-2 transition-all duration-500">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">Achievements</h4>
                    <p className="text-base text-foreground leading-relaxed">{credentials.achievements}</p>
                  </div>
                </div>
              )}

              {!hasContent && isAdmin && (
                <div className="text-center py-8">
                  <p className="text-base text-muted-foreground leading-relaxed mb-4">No credentials added yet</p>
                  <Button onClick={handleEdit} className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent text-white">
                    Add Credentials
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Edit Doctor Credentials
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Textarea
                id="qualifications"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                placeholder="MBBS, MD, Fellowship..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specializations">Specializations</Label>
              <Textarea
                id="specializations"
                value={formData.specializations}
                onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                placeholder="Cardiology, Internal Medicine..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                placeholder="15+ years"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achievements">Professional Achievements</Label>
              <Textarea
                id="achievements"
                value={formData.achievements}
                onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                placeholder="Awards, certifications, publications..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={updateCredentialsMutation.isPending}
              className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent text-white"
            >
              {updateCredentialsMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
