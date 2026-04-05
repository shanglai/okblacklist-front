'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitDecision } from '@/hooks/useSearch';
import { toast } from 'sonner';

export function DecisionActionBar({ entityId, source, currentDecision, onDecisionMade }) {
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [pendingDecision, setPendingDecision] = useState(null);
  const [note, setNote] = useState('');
  const { mutate: submitDecision, isPending } = useSubmitDecision();

  const handleDecision = (status) => {
    setPendingDecision(status);
    setShowNoteDialog(true);
  };

  const confirmDecision = () => {
    submitDecision(
      {
        entity_id: entityId,
        source: source,
        decision_status: pendingDecision,
        reviewer_notes: note || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Decision recorded: ${pendingDecision}`);
          setShowNoteDialog(false);
          setNote('');
          setPendingDecision(null);
          onDecisionMade?.(pendingDecision);
        },
        onError: (error) => {
          toast.error('Failed to submit decision');
        },
      }
    );
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant={currentDecision === 'CLEAR' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleDecision('CLEAR')}
          className="text-green-500 border-green-500/30 hover:bg-green-500/10"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Clear
        </Button>
        <Button
          variant={currentDecision === 'REVIEW' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleDecision('REVIEW')}
          className="text-amber-500 border-amber-500/30 hover:bg-amber-500/10"
        >
          <AlertTriangle className="w-4 h-4 mr-1" />
          Review
        </Button>
        <Button
          variant={currentDecision === 'HIT' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleDecision('HIT')}
          className="text-red-500 border-red-500/30 hover:bg-red-500/10"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Hit
        </Button>
      </div>

      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {pendingDecision === 'CLEAR' && <CheckCircle className="w-5 h-5 text-green-500" />}
              {pendingDecision === 'REVIEW' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {pendingDecision === 'HIT' && <XCircle className="w-5 h-5 text-red-500" />}
              Confirm {pendingDecision} Decision
            </DialogTitle>
            <DialogDescription>
              Add an optional note to explain your decision.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter notes (optional)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDecision} disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
