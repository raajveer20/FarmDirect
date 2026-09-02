// Multi-Laptop & Multi-Tab Real-Time Event Synchronization Engine
// Uses Server-Sent Events (SSE) over network with BroadcastChannel fallback

// Web Audio API Dual-Tone Chime Generator for Real-Time Alerts
export function playNotificationTone(type = 'order') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'order') {
      // Pleasant double-bell alert for new order
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } else if (type === 'payout') {
      // Triumphant chime for UPI payout
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.7);
    }
  } catch (e) {
    // AudioContext blocked before user interaction, silent fallback
  }
}

export class RealtimeSync {
  constructor(handlers = {}) {
    this.handlers = handlers;
    this.eventSource = null;
    this.channel = null;
    this.init();
  }

  init() {
    // 1. Local BroadcastChannel for instant cross-tab sync on same machine
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('farmdirect_realtime');
        this.channel.onmessage = (e) => {
          this.handleEvent(e.data?.type, e.data?.payload);
        };
      } catch (e) {}
    }

    // 2. Server-Sent Events (SSE) for true network sync across 3 distinct laptops!
    if (typeof window !== 'undefined' && 'EventSource' in window) {
      try {
        this.eventSource = new EventSource('/api/events');

        this.eventSource.addEventListener('PRODUCE_ADDED', (e) => {
          const payload = JSON.parse(e.data);
          this.handleEvent('PRODUCE_ADDED', payload);
        });

        this.eventSource.addEventListener('ORDER_PLACED', (e) => {
          const payload = JSON.parse(e.data);
          this.handleEvent('ORDER_PLACED', payload);
        });

        this.eventSource.addEventListener('ORDER_UPDATED', (e) => {
          const payload = JSON.parse(e.data);
          this.handleEvent('ORDER_UPDATED', payload);
        });

        this.eventSource.addEventListener('PAYOUT_SETTLED', (e) => {
          const payload = JSON.parse(e.data);
          this.handleEvent('PAYOUT_SETTLED', payload);
        });

        this.eventSource.onerror = () => {
          // Reconnection is handled automatically by EventSource
        };
      } catch (e) {}
    }
  }

  handleEvent(type, payload) {
    if (!type || !payload) return;

    if (type === 'PRODUCE_ADDED' && this.handlers.onProduceAdded) {
      this.handlers.onProduceAdded(payload);
    } else if (type === 'ORDER_PLACED' && this.handlers.onOrderPlaced) {
      playNotificationTone('order');
      this.handlers.onOrderPlaced(payload);
    } else if (type === 'ORDER_UPDATED' && this.handlers.onOrderUpdated) {
      this.handlers.onOrderUpdated(payload);
    } else if (type === 'PAYOUT_SETTLED' && this.handlers.onPayoutSettled) {
      playNotificationTone('payout');
      this.handlers.onPayoutSettled(payload);
    }
  }

  broadcast(type, payload) {
    // Send to local BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage({ type, payload });
      } catch (e) {}
    }
  }

  destroy() {
    if (this.channel) this.channel.close();
    if (this.eventSource) this.eventSource.close();
  }
}
