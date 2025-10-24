'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, FileText, Calendar } from 'lucide-react'
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">All Tokens</h1>
          <p className="text-muted-foreground">Browse and manage your design token files</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
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
                    {category}
                  </Button>
                ))}
              </div>
            </div>
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
                <Button>
                  Upload New Tokens
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTokens.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {tokens.length === 0 ? 'No tokens uploaded yet' : 'No tokens match your filters'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {tokens.length === 0 
                    ? 'Upload your first design token file to get started'
                    : 'Try adjusting your search or filter criteria'
                  }
                </p>
                {tokens.length === 0 && (
                  <Link href="/upload">
                    <Button>
                      Upload Tokens
                    </Button>
                  </Link>
                )}
              </div>
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
                        {JSON.stringify(token.token_data).length} chars
                      </TableCell>
                      <TableCell>
                        <Link href={`/tokens/${token.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
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
