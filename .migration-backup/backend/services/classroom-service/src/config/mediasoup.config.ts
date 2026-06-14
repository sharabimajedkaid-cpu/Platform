import { types as mediasoupTypes } from 'mediasoup';

export const mediasoupConfig = {
  worker: {
    logLevel: 'warn' as const,
    logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'] as mediasoupTypes.WorkerLogTag[],
    rtcMinPort: Number(process.env.MEDIASOUP_RTC_MIN_PORT) || 40000,
    rtcMaxPort: Number(process.env.MEDIASOUP_RTC_MAX_PORT) || 49999,
    numWorkers: Number(process.env.MEDIASOUP_NUM_WORKERS) || 2,
  },
  router: {
    mediaCodecs: [
      {
        kind: 'audio' as const,
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video' as const,
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video' as const,
        mimeType: 'video/VP9',
        clockRate: 90000,
        parameters: {
          'profile-id': 2,
        },
      },
      {
        kind: 'video' as const,
        mimeType: 'video/H264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '42e01f',
          'level-asymmetry-allowed': 1,
        },
      },
      {
        kind: 'video' as const,
        mimeType: 'video/AV1',
        clockRate: 90000,
      },
    ] as mediasoupTypes.RouterOptions['mediaCodecs'],
  },
  webRtcTransport: {
    listenIps: [
      {
        ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1',
      },
    ],
    initialAvailableOutgoingBitrate: 1_000_000,
    maxIncomingBitrate: 1_500_000,
  },
};
