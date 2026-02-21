import { useState } from 'react';
import { useGetFooterContent, useUpdateFooterContent } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { FooterContent, FooterSection, FooterLink } from '../../backend';

export default function FooterManager() {
  const { data: footerContent, isLoading, error } = useGetFooterContent();
  const updateFooterContent = useUpdateFooterContent();

  const [contact, setContact] = useState({
    address: '',
    phone: '',
    email: '',
  });
  const [copyright, setCopyright] = useState('');
  const [sections, setSections] = useState<FooterSection[]>([]);
  const [quickLinks, setQuickLinks] = useState<FooterLink[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize state when data loads
  useState(() => {
    if (footerContent) {
      setContact(footerContent.contact);
      setCopyright(footerContent.copyright);
      setSections(footerContent.sections || []);
      setQuickLinks(footerContent.quickLinks || []);
    }
  });

  // Update state when footerContent changes
  if (footerContent && !hasChanges) {
    if (
      contact.address !== footerContent.contact.address ||
      contact.phone !== footerContent.contact.phone ||
      contact.email !== footerContent.contact.email ||
      copyright !== footerContent.copyright ||
      JSON.stringify(sections) !== JSON.stringify(footerContent.sections) ||
      JSON.stringify(quickLinks) !== JSON.stringify(footerContent.quickLinks)
    ) {
      setContact(footerContent.contact);
      setCopyright(footerContent.copyright);
      setSections(footerContent.sections || []);
      setQuickLinks(footerContent.quickLinks || []);
    }
  }

  const handleSave = async () => {
    try {
      const updatedContent: FooterContent = {
        contact,
        copyright,
        sections: sections.map((section, index) => ({
          ...section,
          order: BigInt(index),
        })),
        quickLinks,
        background: footerContent?.background,
      };

      await updateFooterContent.mutateAsync(updatedContent);
      toast.success('Footer content updated successfully!');
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating footer content:', error);
      toast.error('Failed to update footer content');
    }
  };

  const addSection = () => {
    const newSection: FooterSection = {
      title: 'New Section',
      content: '',
      order: BigInt(sections.length),
      divider: false,
    };
    setSections([...sections, newSection]);
    setHasChanges(true);
  };

  const updateSection = (index: number, field: keyof FooterSection, value: string | boolean) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
    setHasChanges(true);
  };

  const deleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setSections(updated);
    setHasChanges(true);
  };

  const moveSectionDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setSections(updated);
    setHasChanges(true);
  };

  const addQuickLink = () => {
    const newLink: FooterLink = {
      name: 'New Link',
      url: '#',
    };
    setQuickLinks([...quickLinks, newLink]);
    setHasChanges(true);
  };

  const updateQuickLink = (index: number, field: keyof FooterLink, value: string) => {
    const updated = [...quickLinks];
    updated[index] = { ...updated[index], [field]: value };
    setQuickLinks(updated);
    setHasChanges(true);
  };

  const deleteQuickLink = (index: number) => {
    setQuickLinks(quickLinks.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load footer content. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Save Button at Top */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Footer Manager</h2>
          <p className="text-muted-foreground">Manage all footer sections, headings, and content</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateFooterContent.isPending || !hasChanges}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {updateFooterContent.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Update contact details displayed in the footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={contact.address}
              onChange={(e) => {
                setContact({ ...contact, address: e.target.value });
                setHasChanges(true);
              }}
              placeholder="Enter clinic address"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={contact.phone}
              onChange={(e) => {
                setContact({ ...contact, phone: e.target.value });
                setHasChanges(true);
              }}
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => {
                setContact({ ...contact, email: e.target.value });
                setHasChanges(true);
              }}
              placeholder="Enter email address"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Manage navigation links in the footer</CardDescription>
            </div>
            <Button onClick={addQuickLink} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {quickLinks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No quick links added yet. Click "Add Link" to create one.
            </p>
          ) : (
            quickLinks.map((link, index) => (
              <div key={index} className="flex gap-4 items-end p-4 border rounded-lg bg-muted/30">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`link-name-${index}`}>Link Name</Label>
                  <Input
                    id={`link-name-${index}`}
                    value={link.name}
                    onChange={(e) => updateQuickLink(index, 'name', e.target.value)}
                    placeholder="e.g., About Us"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`link-url-${index}`}>URL</Label>
                  <Input
                    id={`link-url-${index}`}
                    value={link.url}
                    onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                    placeholder="e.g., #about or https://example.com"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteQuickLink(index)}
                  title="Delete link"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Footer Sections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Footer Sections</CardTitle>
              <CardDescription>
                Create custom sections with headings and content. Use arrows to reorder.
              </CardDescription>
            </div>
            <Button onClick={addSection} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sections.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No custom sections added yet. Click "Add Section" to create one.
            </p>
          ) : (
            sections.map((section, index) => (
              <div key={index} className="p-4 border rounded-lg bg-muted/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Section {index + 1}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveSectionDown(index)}
                      disabled={index === sections.length - 1}
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteSection(index)}
                      title="Delete section"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`section-title-${index}`}>Section Heading</Label>
                  <Input
                    id={`section-title-${index}`}
                    value={section.title}
                    onChange={(e) => updateSection(index, 'title', e.target.value)}
                    placeholder="e.g., About Us, Services, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`section-content-${index}`}>Section Content</Label>
                  <Textarea
                    id={`section-content-${index}`}
                    value={section.content}
                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                    placeholder="Enter section content..."
                    rows={4}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Copyright */}
      <Card>
        <CardHeader>
          <CardTitle>Copyright Text</CardTitle>
          <CardDescription>Update the copyright notice at the bottom of the footer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Input
              id="copyright"
              value={copyright}
              onChange={(e) => {
                setCopyright(e.target.value);
                setHasChanges(true);
              }}
              placeholder={`© ${new Date().getFullYear()} Your Clinic Name. All rights reserved.`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button at Bottom */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateFooterContent.isPending || !hasChanges}
          className="gap-2"
          size="lg"
        >
          <Save className="h-4 w-4" />
          {updateFooterContent.isPending ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}
