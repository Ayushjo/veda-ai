import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from './useSocket';
import { useAssignmentStore } from '@/store/assignmentStore';
import {
  JobQueuedEvent,
  JobProcessingEvent,
  JobCompletedEvent,
  JobFailedEvent,
} from '@/types';

export function useGenerationStatus(assignmentId: string | null) {
  const socket = useSocket();
  const router = useRouter();
  const { setJobStatus, setPaperId } = useAssignmentStore();

  useEffect(() => {
    if (!assignmentId) return;

    // Join the room for this assignment
    socket.emit('subscribe', { assignmentId });

    const onQueued = (data: JobQueuedEvent) => {
      console.log('Job queued:', data);
      setJobStatus('queued');
    };

    const onProcessing = (data: JobProcessingEvent) => {
      console.log('Job processing:', data);
      setJobStatus('processing');
    };

    const onCompleted = (data: JobCompletedEvent) => {
      console.log('Job completed:', data);
      setJobStatus('completed');
      setPaperId(data.paperId);
      // Redirect to paper page after short delay for UX
      setTimeout(() => {
        router.push(`/paper/${data.paperId}`);
      }, 1000);
    };

    const onFailed = (data: JobFailedEvent) => {
      console.error('Job failed:', data);
      setJobStatus('failed');
    };

    socket.on('job:queued', onQueued);
    socket.on('job:processing', onProcessing);
    socket.on('job:completed', onCompleted);
    socket.on('job:failed', onFailed);

    // Cleanup — remove only this hook's listeners
    return () => {
      socket.off('job:queued', onQueued);
      socket.off('job:processing', onProcessing);
      socket.off('job:completed', onCompleted);
      socket.off('job:failed', onFailed);
    };
  }, [assignmentId, socket, router, setJobStatus, setPaperId]);
}
