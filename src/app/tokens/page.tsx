'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoadingSpinner, EmptyState, StatusDot } from '@/components/ui/feedback'
import { Search, FileText, Calendar, Upload, Filter, X, Eye, Download } from 'lucide-react'
import Link from 'next/link'
// import { useRouter } from 'next/navigation' // Unused for now

interface TokenFile {
  id: string
  filename: string
  category: string
  created_at: string
  user_id: string
  file_url: string
  token_data: Record<string, unknown>
}

const categories = ['all', 'foundation', 'spacing', 'brand', 'component', 'platform', 'misc']

export default function TokensPage() {
  const [tokens, setTokens] = useState<TokenFile[]>([])
  const [filteredTokens, setFilteredTokens] = useState<TokenFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  // const router = useRouter() // Unused for now

  useEffect(() => {
    const getTokens = async () => {
      try {
        const { data, error } = await supabase
          .from('token_files')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setTokens(data || [])
        setFilteredTokens(data || [])
      } catch (error) {
        console.error('Error fetching tokens:', error)
      } finally {
        setLoading(false)
      }
    }

    getTokens()
  }, [])

  useEffect(() => {
    let filtered = tokens

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(token => token.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(token =>
        token.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTokens(filtered)
  }, [tokens, searchTerm, selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="mt-2 text-muted-foreground">Loading tokens...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">All Tokens</h1>
              <p className="text-muted-foreground">Browse and manage your design token files</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusDot variant="success" />
              <span className="text-sm text-muted-foreground">{tokens.length} files</span>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <CardTitle>Filters</CardTitle>
            </div>
            <CardDescription>Search and filter your token files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search tokens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={X}
                      iconOnly
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    />
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </div>
            </div>
            {(searchTerm || selectedCategory !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchTerm}"
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={X}
                      iconOnly
                      onClick={() => setSearchTerm('')}
                      className="h-4 w-4 p-0"
                    />
                  </Badge>
                )}
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {selectedCategory}
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={X}
                      iconOnly
                      onClick={() => setSelectedCategory('all')}
                      className="h-4 w-4 p-0"
                    />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Token Files</CardTitle>
                <CardDescription>
                  {filteredTokens.length} of {tokens.length} files
                </CardDescription>
              </div>
              <Link href="/upload">
                <Button icon={Upload} iconPosition="left">
                  Upload New Tokens
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTokens.length === 0 ? (
              <EmptyState
                icon={tokens.length === 0 ? "file" : "search"}
                title={tokens.length === 0 ? 'No tokens uploaded yet' : 'No tokens match your filters'}
                description={tokens.length === 0 
                  ? 'Upload your first design token file to get started'
                  : 'Try adjusting your search or filter criteria'
                }
                action={tokens.length === 0 ? {
                  label: "Upload Tokens",
                  onClick: () => window.location.href = '/upload'
                } : {
                  label: "Clear Filters",
                  onClick: () => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }
                }}
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.filename}</TableCell>
                      <TableCell>
                        <Badge variant={token.category as "default" | "secondary" | "destructive" | "outline" | "foundation" | "spacing" | "brand" | "component" | "platform" | "misc"}>{token.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(token.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{JSON.stringify(token.token_data).length} chars</span>
                          <StatusDot variant="success" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link href={`/tokens/${token.id}`}>
                            <Button variant="outline" size="sm" icon={Eye} iconPosition="left">
                              View
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" icon={Download} iconOnly>
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
