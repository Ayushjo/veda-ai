import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from './useSocket';
import { useAssignmentStore } from '@/store/assignmentStore';
import api from '@/lib/api';
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

    let attempts = 0;
    const MAX_ATTEMPTS = 40; // 40 x 3s = 2 minutes
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;
    let pollInterval: ReturnType<typeof setInterval> | null = null;

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
      if (pollInterval) clearInterval(pollInterval);
      setJobStatus('completed');
      setPaperId(data.paperId);
      // Redirect to paper page after short delay for UX
      redirectTimer = setTimeout(() => {
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

    // Join the room for this assignment after listeners are attached
    socket.emit('subscribe', assignmentId);

    // Polling fallback (catches missed socket events)
    pollInterval = setInterval(async () => {
      attempts++;
      if (attempts > MAX_ATTEMPTS) {
        if (pollInterval) clearInterval(pollInterval);
        console.error('Generation timed out after 2 minutes');
        return;
      }

      try {
        const res = await api.get(`/api/assignments/${assignmentId}/status`);
        if (res.data?.status === 'completed' && res.data?.paperId) {
          if (pollInterval) clearInterval(pollInterval);
          socket.off('job:completed', onCompleted);
          setJobStatus('completed');
          setPaperId(res.data.paperId);
          router.push(`/paper/${res.data.paperId}`);
        }
      } catch {
        // silently continue polling
      }
    }, 3000);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (redirectTimer) clearTimeout(redirectTimer);
      socket.off('job:queued', onQueued);
      socket.off('job:processing', onProcessing);
      socket.off('job:completed', onCompleted);
      socket.off('job:failed', onFailed);
    };
  }, [assignmentId, socket, router, setJobStatus, setPaperId]);
}
