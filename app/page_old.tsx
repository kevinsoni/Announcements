"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Copy, Plus, Trash2, CheckCircle, Clock, Sparkles, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface CustomSection {
  title: string;
  items: string[];
}

interface AnnouncementData {
  liveItems: string[];
  inProgressItems: string[];
  customSections: CustomSection[];
}

export default function Home() {
  const [data, setData] = useState<AnnouncementData>({
    liveItems: [],
    inProgressItems: [],
    customSections: []
  });
  const [newLiveItem, setNewLiveItem] = useState('');
  const [newInProgressItem, setNewInProgressItem] = useState('');
  const [copied, setCopied] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editingItem, setEditingItem] = useState<{ sectionIndex: number, itemIndex: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem('announcementData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('announcementData', JSON.stringify(data));
  }, [data]);

  const addLiveItem = () => {
    if (newLiveItem.trim()) {
      setData(prev => ({
        ...prev,
        liveItems: [...prev.liveItems, newLiveItem.trim()]
      }));
      setNewLiveItem('');
      toast.success('Live item added successfully!');
    }
  };

  const addInProgressItem = () => {
    if (newInProgressItem.trim()) {
      setData(prev => ({
        ...prev,
        inProgressItems: [...prev.inProgressItems, newInProgressItem.trim()]
      }));
      setNewInProgressItem('');
      toast.success('In-progress item added successfully!');
    }
  };

  const removeLiveItem = (index: number) => {
    setData(prev => ({
      ...prev,
      liveItems: prev.liveItems.filter((_, i) => i !== index)
    }));
    toast.success('Item removed');
  };

  const removeInProgressItem = (index: number) => {
    setData(prev => ({
      ...prev,
      inProgressItems: prev.inProgressItems.filter((_, i) => i !== index)
    }));
    toast.success('Item removed');
  };

  const addCustomSection = () => {
    if (newSectionTitle.trim()) {
      setData(prev => ({
        ...prev,
        customSections: [...prev.customSections, { title: newSectionTitle.trim(), items: [] }]
      }));
      setNewSectionTitle('');
      toast.success('Custom section added!');
    }
  };

  const addCustomItem = (sectionIndex: number, item: string) => {
    if (item.trim()) {
      setData(prev => ({
        ...prev,
        customSections: prev.customSections.map((section, i) =>
          i === sectionIndex ? { ...section, items: [...section.items, item.trim()] } : section
        )
      }));
      toast.success('Item added!');
    }
  };

  const removeCustomSection = (sectionIndex: number) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.filter((_, i) => i !== sectionIndex)
    }));
    toast.success('Section removed');
  };

  const removeCustomItem = (sectionIndex: number, itemIndex: number) => {
    setData(prev => ({
      ...prev,
      customSections: prev.customSections.map((section, i) =>
        i === sectionIndex ? { ...section, items: section.items.filter((_, j) => j !== itemIndex) } : section
      )
    }));
    toast.success('Item removed');
  };

  const startEditing = (sectionIndex: number, itemIndex: number, currentValue: string) => {
    setEditingItem({ sectionIndex, itemIndex });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingItem && editValue.trim()) {
      setData(prev => ({
        ...prev,
        customSections: prev.customSections.map((section, i) =>
          i === editingItem.sectionIndex ? {
            ...section,
            items: section.items.map((item, j) =>
              j === editingItem.itemIndex ? editValue.trim() : item
            )
          } : section
        )
      }));
      setEditingItem(null);
      setEditValue('');
      toast.success('Item updated!');
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValue('');
  };

  const generateFormattedText = () => {
    const liveItemsText = data.liveItems.length > 0
      ? data.liveItems.map(item => `- ${item}`).join('\n')
      : '- \n- \n- ';

    // Only include In-Progress section if there are items
    const inProgressSection = data.inProgressItems.length > 0
      ? `\nIn-Progress:\n${data.inProgressItems.map(item => `- ${item}`).join('\n')}`
      : '';

    // Add custom sections
    const customSectionsText = data.customSections.length > 0
      ? data.customSections.map(section =>
        `\n${section.title}:\n${section.items.map(item => `- ${item}`).join('\n')}`
      ).join('')
      : '';

    return `📢 Hello Everyone,
⭐ Below points are live: ⭐
${liveItemsText}
${inProgressSection}
${customSectionsText}

ℹ️NOTE:
- Make sure to HARD REFRESH the webpage to see the latest changes.`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateFormattedText());
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const clearAllData = () => {
    setData({ liveItems: [], inProgressItems: [], customSections: [] });
    toast.success('All data cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 relative">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
              Announcement Tracker
            </h1>
            <Button
  onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
  variant="outline"
  size="sm"
  aria-label="Toggle theme"
  className="absolute right-0 top-1/2 -translate-y-1/2"
>
  {mounted ? (
    resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
  ) : (
    <div className="h-4 w-4" />
  )}
</Button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Manage your project updates and announcements with ease
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Live Items Section */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Live Items
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {data.liveItems.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new live item..."
                    value={newLiveItem}
                    onChange={(e) => setNewLiveItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addLiveItem()}
                    className="flex-1"
                  />
                  <Button
                    onClick={addLiveItem}
                    className="bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {data.liveItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700 group"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="flex-1 text-sm dark:text-gray-200">{item}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLiveItem(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {data.liveItems.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                      No live items yet. Add some above!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* In-Progress Items Section */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Clock className="w-5 h-5" />
                  In-Progress Items
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {data.inProgressItems.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new in-progress item..."
                    value={newInProgressItem}
                    onChange={(e) => setNewInProgressItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addInProgressItem()}
                    className="flex-1"
                  />
                  <Button
                    onClick={addInProgressItem}
                    className="bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {data.inProgressItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700 group"
                    >
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="flex-1 text-sm dark:text-gray-200">{item}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeInProgressItem(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {data.inProgressItems.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                      No in-progress items yet. Add some above!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Custom Sections */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <Sparkles className="w-5 h-5" />
                  Custom Sections
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    {data.customSections.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom section title (e.g., Live Updates)..."
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSection()}
                    className="flex-1"
                  />
                  <Button
                    onClick={addCustomSection}
                    className="bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {data.customSections.map((section, sectionIndex) => (
                    <CustomSectionComponent
                      key={sectionIndex}
                      section={section}
                      sectionIndex={sectionIndex}
                      onAddItem={addCustomItem}
                      onRemoveSection={removeCustomSection}
                      onRemoveItem={removeCustomItem}
                      onStartEdit={startEditing}
                      editingItem={editingItem}
                      editValue={editValue}
                      setEditValue={setEditValue}
                      onSaveEdit={saveEdit}
                      onCancelEdit={cancelEdit}
                    />
                  ))}
                  {data.customSections.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                      No custom sections yet. Add one above!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={clearAllData}
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200">Live Preview</span>
                  <Button
                    onClick={copyToClipboard}
                    className={`transition-all duration-200 ${copied
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Text
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 font-mono text-sm border-2 border-dashed border-gray-200 dark:border-gray-600">
                  <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                    {generateFormattedText()}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-green-500 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.liveItems.length}</div>
                    <div className="text-sm opacity-90">Live Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.inProgressItems.length}</div>
                    <div className="text-sm opacity-90">In-Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.customSections.length}</div>
                    <div className="text-sm opacity-90">Custom Sections</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Copyright Footer */}
        <footer className="mt-12 text-center py-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2025 <b>Kevin Soni.</b> All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
function CustomSectionComponent({
  section,
  sectionIndex,
  onAddItem,
  onRemoveSection,
  onRemoveItem,
  onStartEdit,
  editingItem,
  editValue,
  setEditValue,
  onSaveEdit,
  onCancelEdit
}: {
  section: CustomSection;
  sectionIndex: number;
  onAddItem: (sectionIndex: number, item: string) => void;
  onRemoveSection: (sectionIndex: number) => void;
  onRemoveItem: (sectionIndex: number, itemIndex: number) => void;
  onStartEdit: (sectionIndex: number, itemIndex: number, currentValue: string) => void;
  editingItem: { sectionIndex: number, itemIndex: number } | null;
  editValue: string;
  setEditValue: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
}) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    onAddItem(sectionIndex, newItem);
    setNewItem('');
  };

  return (
    <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/30">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-purple-800 dark:text-purple-300">{section.title}</h4>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemoveSection(sectionIndex)}
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Add item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          className="flex-1 text-sm"
        />
        <Button size="sm" onClick={handleAddItem}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {section.items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border dark:border-gray-600 group">
            {editingItem?.sectionIndex === sectionIndex && editingItem?.itemIndex === itemIndex ? (
              <>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSaveEdit()}
                  className="flex-1 text-sm"
                  autoFocus
                />
                <Button size="sm" onClick={onSaveEdit} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                  ✕
                </Button>
              </>
            ) : (
              <>
                <span
                  className="flex-1 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 p-1 rounded"
                  onClick={() => onStartEdit(sectionIndex, itemIndex, item)}
                >
                  {item}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(sectionIndex, itemIndex)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}