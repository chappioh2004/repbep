import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Camera, Github, Twitter, Linkedin, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../services/api';
import Navbar from './Navbar';
import { toast } from '../hooks/use-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [saved, setSaved] = useState(false);

  const colorSchemes = [
    { name: 'Emerald', value: 'emerald', color: 'bg-emerald-500' },
    { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
    { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
    { name: 'Rose', value: 'rose', color: 'bg-rose-500' },
    { name: 'Orange', value: 'orange', color: 'bg-orange-500' }
  ];

  const handleSave = () => {
    // Simulate save
    setSaved(true);
    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.'
    });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSocialChange = (platform, value) => {
    setProfile({
      ...profile,
      socialLinks: { ...profile.socialLinks, [platform]: value }
    });
  };

  const handleWorkspaceChange = (setting, value) => {
    setProfile({
      ...profile,
      workspaceSettings: { ...profile.workspaceSettings, [setting]: value }
    });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar isAuthenticated={true} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="text-gray-400 mt-1">Customize your Repbep experience</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and public profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 border-4 border-emerald-500">
                    <AvatarImage src={profile.avatar} alt={profile.displayName} />
                    <AvatarFallback className="text-2xl">{profile.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Avatar
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => handleChange('displayName', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 focus:border-emerald-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 focus:border-emerald-500"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    className="bg-gray-800/50 border-gray-700 focus:border-emerald-500 min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <Label>Social Links</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Github className="w-5 h-5 text-gray-400" />
                      </div>
                      <Input
                        value={profile.socialLinks.github}
                        onChange={(e) => handleSocialChange('github', e.target.value)}
                        placeholder="GitHub profile URL"
                        className="bg-gray-800/50 border-gray-700 focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Twitter className="w-5 h-5 text-gray-400" />
                      </div>
                      <Input
                        value={profile.socialLinks.twitter}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        placeholder="Twitter profile URL"
                        className="bg-gray-800/50 border-gray-700 focus:border-emerald-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-gray-400" />
                      </div>
                      <Input
                        value={profile.socialLinks.linkedin}
                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        placeholder="LinkedIn profile URL"
                        className="bg-gray-800/50 border-gray-700 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme */}
                <div className="space-y-3">
                  <Label>Theme</Label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleChange('theme', 'dark')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        profile.theme === 'dark'
                          ? 'border-emerald-500 bg-gray-800'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="w-full h-20 bg-gradient-to-br from-gray-900 to-gray-950 rounded mb-2"></div>
                      <p className="text-sm font-medium">Dark</p>
                    </button>
                    <button
                      onClick={() => handleChange('theme', 'light')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        profile.theme === 'light'
                          ? 'border-emerald-500 bg-gray-800'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="w-full h-20 bg-gradient-to-br from-gray-100 to-white rounded mb-2"></div>
                      <p className="text-sm font-medium">Light</p>
                    </button>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="space-y-3">
                  <Label>Accent Color</Label>
                  <div className="grid grid-cols-5 gap-3">
                    {colorSchemes.map((scheme) => (
                      <button
                        key={scheme.value}
                        onClick={() => handleChange('colorScheme', scheme.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          profile.colorScheme === scheme.value
                            ? 'border-emerald-500 bg-gray-800'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        <div className={`w-full h-12 ${scheme.color} rounded mb-2`}></div>
                        <p className="text-xs font-medium">{scheme.name}</p>
                        {profile.colorScheme === scheme.value && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workspace Tab */}
          <TabsContent value="workspace" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Workspace Preferences</CardTitle>
                <CardDescription>Configure your development environment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto Save */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Save</Label>
                    <p className="text-sm text-gray-400">Automatically save your work</p>
                  </div>
                  <Switch
                    checked={profile.workspaceSettings.autoSave}
                    onCheckedChange={(checked) => handleWorkspaceChange('autoSave', checked)}
                  />
                </div>

                {/* Code Completion */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Code Completion</Label>
                    <p className="text-sm text-gray-400">Enable AI-powered code suggestions</p>
                  </div>
                  <Switch
                    checked={profile.workspaceSettings.codeCompletion}
                    onCheckedChange={(checked) => handleWorkspaceChange('codeCompletion', checked)}
                  />
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications</Label>
                    <p className="text-sm text-gray-400">Receive updates about your projects</p>
                  </div>
                  <Switch
                    checked={profile.workspaceSettings.notifications}
                    onCheckedChange={(checked) => handleWorkspaceChange('notifications', checked)}
                  />
                </div>

                {/* Account Info */}
                <div className="pt-6 border-t border-gray-800">
                  <Label className="mb-3 block">Account Information</Label>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Member since</span>
                      <span className="text-white">{new Date(profile.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account ID</span>
                      <span className="text-white font-mono">{profile.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Plan</span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Pro</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={saved}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
