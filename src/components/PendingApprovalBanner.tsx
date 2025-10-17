import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

const PendingApprovalBanner = ({ onDismiss }: { onDismiss?: () => void }) => {
  const whatsappNumber = '254743375997'
  const message = encodeURIComponent('Hello, please approve my broker account.')
  const link = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`
  return (
    <div className="w-full bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <Alert>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>Your account is pending admin approval. You will gain access once approved.</span>
            <div className="flex items-center gap-2">
              <a href={link} target="_blank" rel="noreferrer">
                <Button size="sm" variant="outline">Contact Admin</Button>
              </a>
              <Button size="sm" variant="ghost" onClick={onDismiss}>Dismiss</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

export default PendingApprovalBanner
