"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Copy, Plus, Trash2, CheckCircle, Clock, Sparkles } from 'lucide-react';

interface AnnouncementData {
  liveItems: string[];
  inProgressItems: string[];
}

export default function Home() {
  const [data, setData] = useState<AnnouncementData>({
    liveItems: [],
    inProgressItems: []
  });
  const [newLiveItem, setNewLiveItem] = useState('');
  const [newInProgressItem, setNewInProgressItem] = useState('');
  const [copied, setCopied] = useState(false);

  // Load data from localStorage on component mount
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

  // Save data to localStorage whenever data changes
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

  const generateFormattedText = () => {
    const liveItemsText = data.liveItems.length > 0 
      ? data.liveItems.map(item => `- ${item}`).join('\n')
      : '- \n- \n- ';
    
    const inProgressText = data.inProgressItems.length > 0 
      ? data.inProgressItems.map(item => `- ${item}`).join('\n')
      : '- \n- ';

    return `Hello Everyone,
Below points are live:
${liveItemsText}

In-Progress:
${inProgressText}

NOTE: 
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
    setData({ liveItems: [], inProgressItems: [] });
    toast.success('All data cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Announcement Tracker
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your project updates and announcements with ease
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Live Items Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  Live Items
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
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
                      className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200 group"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="flex-1 text-sm">{item}</span>
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
                    <p className="text-gray-500 text-sm text-center py-4">
                      No live items yet. Add some above!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* In-Progress Items Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Clock className="w-5 h-5" />
                  In-Progress Items
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
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
                      className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200 group"
                    >
                      <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="flex-1 text-sm">{item}</span>
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
                    <p className="text-gray-500 text-sm text-center py-4">
                      No in-progress items yet. Add some above!
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
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-gray-800">Live Preview</span>
                  <Button
                    onClick={copyToClipboard}
                    className={`transition-all duration-200 ${
                      copied 
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
                <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm border-2 border-dashed border-gray-200">
                  <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {generateFormattedText()}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-green-500 text-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.liveItems.length}</div>
                    <div className="text-sm opacity-90">Live Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{data.inProgressItems.length}</div>
                    <div className="text-sm opacity-90">In-Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}