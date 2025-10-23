'use client'

import { useEffect, useState, use } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, User, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface TokenFile {
  id: string
  filename: string
  category: string
  created_at: string
  user_id: string
  file_url: string
  token_data: any
}

export default function TokenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [token, setToken] = useState<TokenFile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Unwrap the params using React.use()
  const { id } = use(params)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase
          .from('token_files')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        setToken(data)
      } catch (error) {
        console.error('Error fetching token:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchToken()
  }, [id, router])

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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Token not found</h1>
          <p className="text-muted-foreground mb-4">The requested token file could not be found.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const renderTokenData = (data: any, depth = 0) => {
    if (typeof data === 'object' && data !== null) {
      return (
        <div className={`ml-${depth * 4}`}>
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-primary">{key}:</span>
                {typeof value === 'object' && value !== null ? (
                  <span className="text-muted-foreground">Object</span>
                ) : (
                  <span className="text-foreground">
                    {typeof value === 'string' ? `"${value}"` : String(value)}
                  </span>
                )}
              </div>
              {typeof value === 'object' && value !== null && (
                <div className="ml-4 mt-1">
                  {renderTokenData(value, depth + 1)}
                </div>
              )}
            </div>
          ))}
        </div>
      )
    }
    return <span>{String(data)}</span>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{token.filename}</h1>
              <p className="text-muted-foreground">Design token file details</p>
            </div>
            <Badge variant={token.category as any} className="text-lg px-3 py-1">
              {token.category}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  File Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Filename</label>
                  <p className="text-sm">{token.filename}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <div className="mt-1">
                    <Badge variant={token.category as any}>{token.category}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Uploaded</label>
                  <p className="text-sm flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(token.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">File Size</label>
                  <p className="text-sm">
                    {JSON.stringify(token.token_data).length} characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Token Data</CardTitle>
                <CardDescription>
                  Hierarchical view of your design tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                  <pre className="text-sm">
                    {renderTokenData(token.token_data)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Raw JSON</CardTitle>
            <CardDescription>
              Complete JSON structure of the token file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
              {JSON.stringify(token.token_data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
