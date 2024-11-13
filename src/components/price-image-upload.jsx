'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PriceImageUpload() {
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Uploading...')

    const formData = new FormData()
    formData.append('price', price)
    if (image) {
      formData.append('image', image)
    }

    try {
      const response = await fetch('http://localhost:3000/api/noway', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setStatus('Upload successful!')
        setPrice('')
        setImage(null)
      } else {
        setStatus('Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setStatus('An error occurred. Please try again.')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Price and Image</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e)=>{handleSubmit(e)}} className="space-y-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
            />
          </div>
          <Button type="submit">Upload</Button>
        </form>
        {status && <p className="mt-4 text-center">{status}</p>}
      </CardContent>
    </Card>
  )
}