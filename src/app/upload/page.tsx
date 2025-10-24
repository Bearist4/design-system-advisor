'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Upload, FileText, X, Check, AlertCircle, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { categorizeTokens } from '@/lib/utils'

interface UploadedFile {
  file: File
  content: unknown
  category: string
  isValid: boolean
  error?: string
  categoryManuallySet?: boolean
}

const CATEGORY_OPTIONS = [
  { value: 'foundation', label: 'Foundation', description: 'Colors, typography, fonts' },
  { value: 'spacing', label: 'Spacing', description: 'Spacing, grid, layout' },
  { value: 'brand', label: 'Brand', description: 'Brand-specific tokens' },
  { value: 'component', label: 'Component', description: 'Buttons, inputs, cards' },
  { value: 'platform', label: 'Platform', description: 'iOS, Android, web' },
  { value: 'animation', label: 'Animation', description: 'Transitions, durations' },
  { value: 'elevation', label: 'Elevation', description: 'Shadows, depth' },
  { value: 'misc', label: 'Misc', description: 'Other tokens' }
]

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uploadMessage, setUploadMessage] = useState('')
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const router = useRouter()

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    const jsonFiles = files.filter(file => {
      const isValidExtension = file.name.toLowerCase().endsWith('.json')
      const isValidType = file.type === 'application/json' || file.type === 'text/json' || file.type === ''
      
      if (!isValidExtension && !isValidType) {
        // Add invalid file to show error
        setUploadedFiles(prev => [...prev, {
          file,
          content: null,
          category: 'invalid',
          isValid: false,
          error: 'Invalid file type. Only JSON files are allowed.'
        }])
        return false
      }
      return true
    })
    
    for (const file of jsonFiles) {
      try {
        const content = await file.text()
        
        // Check if file is empty
        if (!content.trim()) {
          setUploadedFiles(prev => [...prev, {
            file,
            content: null,
            category: 'invalid',
            isValid: false,
            error: 'File is empty'
          }])
          continue
        }
        
        const parsedContent = JSON.parse(content)
        const category = categorizeTokens(file.name, parsedContent)
        
        setUploadedFiles(prev => [...prev, {
          file,
          content: parsedContent,
          category,
          isValid: true,
          categoryManuallySet: false
        }])
      } catch (error) {
        console.error('Error parsing file:', file.name, error)
        setUploadedFiles(prev => [...prev, {
          file,
          content: null,
          category: 'invalid',
          isValid: false,
          error: error instanceof SyntaxError ? 'Invalid JSON format' : 'Error reading file'
        }])
      }
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const updateFileCategory = (index: number, newCategory: string) => {
    setUploadedFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, category: newCategory, categoryManuallySet: true } : file
    ))
    setEditingCategory(null)
  }

  const startEditingCategory = (index: number) => {
    setEditingCategory(index)
  }

  const cancelEditingCategory = () => {
    setEditingCategory(null)
  }

  const resetToAutoCategory = (index: number) => {
    const file = uploadedFiles[index]
    const autoCategory = categorizeTokens(file.file.name, file.content)
    setUploadedFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, category: autoCategory, categoryManuallySet: false } : f
    ))
  }

  const uploadFiles = async () => {
    setIsUploading(true)
    setUploadStatus('idle')
    setUploadMessage('')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Only upload valid files
      const validFiles = uploadedFiles.filter(file => file.isValid)
      
      if (validFiles.length === 0) {
        setUploadStatus('error')
        setUploadMessage('No valid files to upload')
        setIsUploading(false)
        return
      }

      let successCount = 0
      let errorCount = 0

      for (const uploadedFile of validFiles) {
        try {
          // Upload file to Supabase Storage
          const fileExt = uploadedFile.file.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
          
          const { error: uploadError } = await supabase.storage
            .from('token-files')
            .upload(fileName, uploadedFile.file)

          if (uploadError) throw uploadError

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('token-files')
            .getPublicUrl(fileName)

          // Save metadata to database
          const { error: dbError } = await supabase
            .from('token_files')
            .insert({
              filename: uploadedFile.file.name,
              category: uploadedFile.category,
              file_url: publicUrl,
              token_data: uploadedFile.content,
              user_id: user.id
            })

          if (dbError) throw dbError
          
          successCount++
        } catch (fileError: unknown) {
          console.error('Error uploading file:', uploadedFile.file.name, fileError)
          errorCount++
        }
      }

      if (successCount > 0) {
        setUploadStatus('success')
        setUploadMessage(`Successfully uploaded ${successCount} file(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}`)
        
        // Clear uploaded files and redirect after a short delay
        setTimeout(() => {
          setUploadedFiles([])
          router.push('/dashboard')
        }, 2000)
      } else {
        setUploadStatus('error')
        setUploadMessage('Failed to upload any files')
      }
    } catch (error: unknown) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      const errorObj = error as { message?: string }
      setUploadMessage('Error uploading files: ' + (errorObj.message || 'Unknown error'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Design Tokens</h1>
          <p className="text-muted-foreground">Upload your design token JSON files</p>
          
          {uploadStatus !== 'idle' && (
            <div className={`mt-4 p-4 rounded-lg ${
              uploadStatus === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-center">
                {uploadStatus === 'success' ? (
                  <Check className="h-5 w-5 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 mr-2" />
                )}
                <span className="font-medium">{uploadMessage}</span>
              </div>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Drag and drop your JSON files or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop your JSON files here</p>
              <p className="text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <input
                type="file"
                multiple
                accept=".json"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button variant="outline" asChild>
                  <span>Choose Files</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {uploadedFiles.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Uploaded Files</CardTitle>
              <CardDescription>
                Review your files before uploading. Click on any category badge to change it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 border rounded-lg ${
                      !uploadedFile.isValid ? 'border-red-200 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {uploadedFile.isValid ? (
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      ) : (
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{uploadedFile.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.file.size / 1024).toFixed(1)} KB
                        </p>
                        {!uploadedFile.isValid && uploadedFile.error && (
                          <p className="text-sm text-red-600 mt-1">{uploadedFile.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {uploadedFile.isValid ? (
                        <>
                          {editingCategory === index ? (
                            <div className="space-y-3 p-3 bg-gray-50 rounded-lg border">
                              <div className="text-sm font-medium text-gray-700">Choose a category:</div>
                              <div className="flex flex-wrap gap-2">
                                {CATEGORY_OPTIONS.map(option => (
                                  <Button
                                    key={option.value}
                                    onClick={() => updateFileCategory(index, option.value)}
                                    variant={uploadedFile.category === option.value ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full"
                                  >
                                    {option.label}
                                  </Button>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  {CATEGORY_OPTIONS.find(opt => opt.value === uploadedFile.category)?.description}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelEditingCategory}
                                  className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Button
                                  onClick={() => startEditingCategory(index)}
                                  variant="ghost"
                                  size="sm"
                                  className="group"
                                >
                                  <Badge 
                                    variant={uploadedFile.category as "default" | "secondary" | "destructive" | "outline" | "foundation" | "spacing" | "brand" | "component" | "platform" | "misc"}
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                  >
                                    {CATEGORY_OPTIONS.find(opt => opt.value === uploadedFile.category)?.label || uploadedFile.category}
                                  </Badge>
                                </Button>
                                {uploadedFile.categoryManuallySet && (
                                  <span className="text-xs text-blue-600 font-medium">(edited)</span>
                                )}
                              </div>
                              {uploadedFile.categoryManuallySet && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => resetToAutoCategory(index)}
                                  className="px-2 py-1 h-6 text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                                  title="Reset to auto-detected category"
                                >
                                  ↶ Reset
                                </Button>
                              )}
                            </div>
                          )}
                        </>
                      ) : (
                        <Badge variant="destructive">Invalid</Badge>
                      )}
                      {uploadedFile.isValid && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewFile(uploadedFile)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-muted-foreground">
                  {uploadedFiles.filter(f => f.isValid).length} valid files ready to upload
                  {uploadedFiles.filter(f => !f.isValid).length > 0 && (
                    <span className="text-red-600 ml-2">
                      ({uploadedFiles.filter(f => !f.isValid).length} invalid files will be skipped)
                    </span>
                  )}
                </div>
                <Button
                  onClick={uploadFiles}
                  disabled={isUploading || uploadedFiles.filter(f => f.isValid).length === 0}
                  className="min-w-[120px]"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Upload {uploadedFiles.filter(f => f.isValid).length} Files
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Modal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          title={previewFile?.file.name}
        >
          {previewFile && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant={previewFile.category as "default" | "secondary" | "destructive" | "outline" | "foundation" | "spacing" | "brand" | "component" | "platform" | "misc"}>
                  {previewFile.category}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {(previewFile.file.size / 1024).toFixed(1)} KB
                </span>
                <span className="text-sm text-muted-foreground">
                  • {typeof previewFile.content === 'object' && previewFile.content !== null ? Object.keys(previewFile.content as Record<string, unknown>).length : 0} top-level keys
                </span>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Token Structure Preview:</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Top-level keys:</div>
                  <div className="flex flex-wrap gap-2">
                    {typeof previewFile.content === 'object' && previewFile.content !== null ? Object.keys(previewFile.content as Record<string, unknown>).slice(0, 10).map((key, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {key}
                      </Badge>
                    )) : []}
                    {typeof previewFile.content === 'object' && previewFile.content !== null && Object.keys(previewFile.content as Record<string, unknown>).length > 10 && (
                      <Badge variant="outline" className="text-xs">
                        +{Object.keys(previewFile.content as Record<string, unknown>).length - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Raw JSON:</h4>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  {JSON.stringify(previewFile.content, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
