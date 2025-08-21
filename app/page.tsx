"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Copy, Plus, Trash2, CheckCircle, Clock, Sparkles, Moon, Sun, Edit3, Save, GripVertical } from 'lucide-react';
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
  const [editingItem, setEditingItem] = useState<{sectionIndex: number, itemIndex: number} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isEditingPreview, setIsEditingPreview] = useState(false);
  const [previewEditValue, setPreviewEditValue] = useState('');
  const [customPreviewText, setCustomPreviewText] = useState('');
  const [editingLiveItem, setEditingLiveItem] = useState<number | null>(null);
  const [editingInProgressItem, setEditingInProgressItem] = useState<number | null>(null);
  const [liveEditValue, setLiveEditValue] = useState('');
  const [inProgressEditValue, setInProgressEditValue] = useState('');
  const [draggedItem, setDraggedItem] = useState<{type: string, sectionIndex?: number, itemIndex: number} | null>(null);
  const { setTheme, resolvedTheme } = useTheme();

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

  const startEditingLiveItem = (index: number, currentValue: string) => {
    setEditingLiveItem(index);
    setLiveEditValue(currentValue);
  };

  const saveLiveItemEdit = () => {
    if (editingLiveItem !== null && liveEditValue.trim()) {
      setData(prev => ({
        ...prev,
        liveItems: prev.liveItems.map((item, i) => 
          i === editingLiveItem ? liveEditValue.trim() : item
        )
      }));
      setEditingLiveItem(null);
      setLiveEditValue('');
      toast.success('Live item updated!');
    }
  };

  const cancelLiveItemEdit = () => {
    setEditingLiveItem(null);
    setLiveEditValue('');
  };

  const startEditingInProgressItem = (index: number, currentValue: string) => {
    setEditingInProgressItem(index);
    setInProgressEditValue(currentValue);
  };

  const saveInProgressItemEdit = () => {
    if (editingInProgressItem !== null && inProgressEditValue.trim()) {
      setData(prev => ({
        ...prev,
        inProgressItems: prev.inProgressItems.map((item, i) => 
          i === editingInProgressItem ? inProgressEditValue.trim() : item
        )
      }));
      setEditingInProgressItem(null);
      setInProgressEditValue('');
      toast.success('In-progress item updated!');
    }
  };

  const cancelInProgressItemEdit = () => {
    setEditingInProgressItem(null);
    setInProgressEditValue('');
  };

  const moveItem = (type: string, sectionIndex: number | undefined, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setData(prev => {
      if (type === 'live') {
        const newItems = [...prev.liveItems];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        return { ...prev, liveItems: newItems };
      } else if (type === 'inProgress') {
        const newItems = [...prev.inProgressItems];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        return { ...prev, inProgressItems: newItems };
      } else if (type === 'custom' && sectionIndex !== undefined) {
        const newSections = [...prev.customSections];
        const newItems = [...newSections[sectionIndex].items];
        const [movedItem] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, movedItem);
        newSections[sectionIndex] = { ...newSections[sectionIndex], items: newItems };
        return { ...prev, customSections: newSections };
      }
      return prev;
    });
  };

  const handleDragStart = (e: React.DragEvent, type: string, sectionIndex: number | undefined, itemIndex: number) => {
    setDraggedItem({ type, sectionIndex, itemIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, type: string, sectionIndex: number | undefined, dropIndex: number) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== type || draggedItem.sectionIndex !== sectionIndex) return;
    
    moveItem(type, sectionIndex, draggedItem.itemIndex, dropIndex);
    setDraggedItem(null);
  };

  const generateFormattedText = () => {
    const liveItemsText = data.liveItems.length > 0
      ? data.liveItems.map(item => `- ${item}`).join('\n')
      : '- \n- \n- ';

    const inProgressSection = data.inProgressItems.length > 0
      ? `\nIn-Progress:\n${data.inProgressItems.map(item => `- ${item}`).join('\n')}`
      : '';

    const customSectionsText = data.customSections.length > 0
      ? data.customSections.map(section => 
          `\n${section.title}:\n${section.items.map(item => `- ${item}`).join('\n')}`
        ).join('\n')
      : '';

    return `📢 Hello Everyone,
⭐ Below points are live: ⭐
${liveItemsText}
${inProgressSection}
${customSectionsText}

ℹ️NOTE:
- Make sure to HARD REFRESH the webpage to see the latest changes.`;
  };

  const startEditingPreview = () => {
    setPreviewEditValue(customPreviewText || generateFormattedText());
    setIsEditingPreview(true);
  };

  const savePreviewEdit = () => {
    setCustomPreviewText(previewEditValue);
    setIsEditingPreview(false);
    toast.success('Preview updated!');
  };

  const cancelPreviewEdit = () => {
    setIsEditingPreview(false);
    setPreviewEditValue('');
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = isEditingPreview ? previewEditValue : (customPreviewText || generateFormattedText());
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const clearAllData = () => {
    setData({ liveItems: [], inProgressItems: [], customSections: [] });
    setCustomPreviewText('');
    setEditingLiveItem(null);
    setEditingInProgressItem(null);
    setLiveEditValue('');
    setInProgressEditValue('');
    toast.success('All data cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4 relative">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
              Weekly Tracker
            </h1>
            <Button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              variant="outline"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-gray-600 dark:text-slate-300 text-lg">
            Manage your project updates and announcements with ease
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Live Items Section */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm dark:shadow-slate-900/50">
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
                    className="flex-1 dark:bg-slate-700 dark:border-slate-600"
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
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'live', undefined, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'live', undefined, index)}
                      className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 group cursor-move hover:shadow-md transition-shadow"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      {editingLiveItem === index ? (
                        <>
                          <Input
                            value={liveEditValue}
                            onChange={(e) => setLiveEditValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && saveLiveItemEdit()}
                            className="flex-1 text-sm dark:bg-slate-700 dark:border-slate-600"
                            autoFocus
                          />
                          <Button size="sm" onClick={saveLiveItemEdit} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelLiveItemEdit}>
                            ✕
                          </Button>
                        </>
                      ) : (
                        <>
                          <span 
                            className="flex-1 text-sm cursor-pointer hover:bg-green-100 dark:hover:bg-green-800/30 dark:text-slate-200 p-1 rounded"
                            onClick={() => startEditingLiveItem(index, item)}
                          >
                            {item}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeLiveItem(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                  {data.liveItems.length === 0 && (
                    <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">
                      No live items yet. Add some above!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* In-Progress Items Section */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm dark:shadow-slate-900/50">
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
                    className="flex-1 dark:bg-slate-700 dark:border-slate-600"
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
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'inProgress', undefined, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'inProgress', undefined, index)}
                      className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 group cursor-move hover:shadow-md transition-shadow"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      {editingInProgressItem === index ? (
                        <>
                          <Input
                            value={inProgressEditValue}
                            onChange={(e) => setInProgressEditValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && saveInProgressItemEdit()}
                            className="flex-1 text-sm dark:bg-slate-700 dark:border-slate-600"
                            autoFocus
                          />
                          <Button size="sm" onClick={saveInProgressItemEdit} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={cancelInProgressItemEdit}>
                            ✕
                          </Button>
                        </>
                      ) : (
                        <>
                          <span 
                            className="flex-1 text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800/30 dark:text-slate-200 p-1 rounded"
                            onClick={() => startEditingInProgressItem(index, item)}
                          >
                            {item}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeInProgressItem(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                  {data.inProgressItems.length === 0 && (
                    <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">
                      No in-progress items yet. Add some above!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Custom Sections */}
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm dark:shadow-slate-900/50">
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
                    placeholder="Add custom section title (e.g., Functional Team Task)..."
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSection()}
                    className="flex-1 dark:bg-slate-700 dark:border-slate-600"
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
                      onMoveItem={(sectionIndex, fromIndex, toIndex) => {
                        setData(prev => ({
                          ...prev,
                          customSections: prev.customSections.map((section, i) => 
                            i === sectionIndex ? {
                              ...section,
                              items: (() => {
                                const newItems = [...section.items];
                                const [movedItem] = newItems.splice(fromIndex, 1);
                                newItems.splice(toIndex, 0, movedItem);
                                return newItems;
                              })()
                            } : section
                          )
                        }));
                      }}
                    />
                  ))}
                  {data.customSections.length === 0 && (
                    <p className="text-gray-500 dark:text-slate-400 text-sm text-center py-4">
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
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm dark:shadow-slate-900/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-slate-200">Live Preview</span>
                  <div className="flex gap-2">
                    {isEditingPreview ? (
                      <>
                        <Button
                          onClick={savePreviewEdit}
                          className="bg-green-600 hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={cancelPreviewEdit}
                          variant="outline"
                          className="border-gray-300 dark:border-slate-600"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={startEditingPreview}
                          variant="outline"
                          className="border-gray-300 dark:border-slate-600"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        {customPreviewText && (
                          <Button
                            onClick={() => {
                              setCustomPreviewText('');
                              toast.success('Reset to auto-generated preview!');
                            }}
                            variant="outline"
                            className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-400 dark:hover:bg-orange-900/20"
                          >
                            Reset
                          </Button>
                        )}
                      </>
                    )}
                    <Button
                      onClick={copyToClipboard}
                      className={`transition-all duration-200 ${copied
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-600 hover:bg-gray-700 dark:bg-slate-600 dark:hover:bg-slate-700'
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
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingPreview ? (
                  <textarea
                    value={previewEditValue}
                    onChange={(e) => setPreviewEditValue(e.target.value)}
                    className="w-full h-96 bg-gray-50 dark:bg-slate-900/80 rounded-lg p-6 font-mono text-sm border-2 border-dashed border-gray-200 dark:border-slate-600 text-gray-800 dark:text-slate-200 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Edit your preview text here..."
                  />
                ) : (
                  <div className="bg-gray-50 dark:bg-slate-900/80 rounded-lg p-6 font-mono text-sm border-2 border-dashed border-gray-200 dark:border-slate-600">
                    <pre className="whitespace-pre-wrap text-gray-800 dark:text-slate-200 leading-relaxed">
                      {customPreviewText || generateFormattedText()}
                    </pre>
                  </div>
                )}
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
        <footer className="mt-12 text-center py-6 border-t border-gray-200 dark:border-slate-700">
          <p className="text-gray-600 dark:text-slate-400 text-sm">
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
  onCancelEdit,
  onMoveItem 
}: {
  section: CustomSection;
  sectionIndex: number;
  onAddItem: (sectionIndex: number, item: string) => void;
  onRemoveSection: (sectionIndex: number) => void;
  onRemoveItem: (sectionIndex: number, itemIndex: number) => void;
  onStartEdit: (sectionIndex: number, itemIndex: number, currentValue: string) => void;
  editingItem: {sectionIndex: number, itemIndex: number} | null;
  editValue: string;
  setEditValue: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onMoveItem: (sectionIndex: number, fromIndex: number, toIndex: number) => void;
}) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    onAddItem(sectionIndex, newItem);
    setNewItem('');
  };

  return (
    <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-purple-800 dark:text-purple-200">{section.title}</h4>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemoveSection(sectionIndex)}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
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
          className="flex-1 text-sm dark:bg-slate-700 dark:border-slate-600"
        />
        <Button size="sm" onClick={handleAddItem}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {section.items.map((item, itemIndex) => (
          <div 
            key={itemIndex} 
            draggable
            onDragStart={(e) => {
              const dragData = { type: 'custom', sectionIndex, itemIndex };
              e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
              e.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
            }}
            onDrop={(e) => {
              e.preventDefault();
              const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
              if (dragData.type === 'custom' && dragData.sectionIndex === sectionIndex) {
                const fromIndex = dragData.itemIndex;
                const toIndex = itemIndex;
                if (fromIndex !== toIndex) {
                  const newItems = [...section.items];
                  const [movedItem] = newItems.splice(fromIndex, 1);
                  newItems.splice(toIndex, 0, movedItem);
                  // Update the section through the parent component
                  onMoveItem(sectionIndex, fromIndex, toIndex);
                }
              }
            }}
            className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded border dark:border-slate-600 group cursor-move hover:shadow-md transition-shadow"
          >
            <GripVertical className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
            {editingItem?.sectionIndex === sectionIndex && editingItem?.itemIndex === itemIndex ? (
              <>
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSaveEdit()}
                  className="flex-1 text-sm dark:bg-slate-700 dark:border-slate-600"
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
                  className="flex-1 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-slate-200 p-1 rounded"
                  onClick={() => onStartEdit(sectionIndex, itemIndex, item)}
                >
                  {item}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(sectionIndex, itemIndex)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
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