'use client'

import { useState, useRef } from 'react'
import { FiUpload, FiX, FiCamera, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface DeliveryConfirmationProps {
  donationId: string
  onSuccess: () => void
  onCancel: () => void
}

export function DeliveryConfirmation({ donationId, onSuccess, onCancel }: DeliveryConfirmationProps) {
  const [deliveryPhotos, setDeliveryPhotos] = useState<string[]>([])
  const [signature, setSignature] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setDeliveryPhotos((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removePhoto = (index: number) => {
    setDeliveryPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const signatureData = canvas.toDataURL('image/png')
    setSignature(signatureData)
  }

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignature(null)
  }

  const handleSubmit = async () => {
    if (!signature && deliveryPhotos.length === 0) {
      toast.error('Please add at least a signature or delivery photo')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/donations/${donationId}/delivery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientSignature: signature,
          deliveryPhotos: deliveryPhotos,
          notes: notes,
        }),
      })

      if (response.ok) {
        toast.success('Delivery confirmed successfully!')
        onSuccess()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to confirm delivery')
      }
    } catch (error) {
      toast.error('Failed to confirm delivery')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Confirm Delivery</h3>

      {/* Delivery Photos */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Photos (optional)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <FiCamera className="mr-2" />
          Add Photos
        </button>
        {deliveryPhotos.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {deliveryPhotos.map((photo, index) => (
              <div key={index} className="relative">
                <img src={photo} alt={`Delivery ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Signature */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipient Signature *
        </label>
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <canvas
            ref={signatureCanvasRef}
            width={400}
            height={200}
            className="border border-gray-200 rounded cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <div className="mt-2 flex justify-between">
            <button
              onClick={clearSignature}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear
            </button>
            {signature && (
              <span className="text-sm text-green-600 flex items-center">
                <FiCheckCircle className="mr-1" />
                Signature captured
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Any additional notes about the delivery..."
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (!signature && deliveryPhotos.length === 0)}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Delivery'}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

